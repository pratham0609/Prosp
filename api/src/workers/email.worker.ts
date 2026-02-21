import { Worker } from 'bullmq'
import { redisConnection } from '../queue/redis'
import { EMAIL_QUEUE_NAME, emailQueue } from '../queue/email.queue'
// import { prisma } from '../db'
import { getPrisma } from '../db'
const prisma = getPrisma()
import { sendEmail } from '../services/email.service'

// email.worker.ts
new Worker(
  EMAIL_QUEUE_NAME,
  async (job) => {
    try {
      console.log(`[worker] Processing ${job.name}...`, job.data);
      const { leadId, draftId, type, followUpDraftId } = job.data;

      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      const draft = await prisma.emailDraft.findUnique({ where: { id: draftId } });

      if (!lead || !draft) throw new Error('Lead or draft not found');

      // Skip logic...
      if (type === 'FOLLOW_UP' && lead.repliedAt) {
        console.log('[worker] skipping follow-up, already replied');
        return { skipped: true };
      }

      await sendEmail(lead.email, draft.subject, draft.body);

      await prisma.emailSend.create({
        data: { leadId, type, provider: 'resend', status: 'SENT', sentAt: new Date() }
      });

      if (type === 'INITIAL' && followUpDraftId) {
        console.log(`[worker] scheduling follow-up for lead ${leadId}...`);
        
        const followUpJob = await emailQueue.add(
          'send-follow-up',
          { leadId, draftId: followUpDraftId, type: 'FOLLOW_UP' },
          { delay: 30_000 }
        );
        
        console.log(`[worker] Follow-up enqueued successfully. Job ID: ${followUpJob.id}`);
      }

      return { success: true };
    } catch (error) {
      console.error('[worker] FATAL ERROR in job handler:', error);
      // Throwing here allows BullMQ to use the "attempts: 3" logic in your queue config
      throw error; 
    }
  },
  { connection: redisConnection }
);