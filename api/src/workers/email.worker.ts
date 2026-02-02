import { Worker, Queue } from 'bullmq'
import { redisConnection } from '../queue/redis'
const emailQueue = new Queue('email-send', { connection: redisConnection })
import { prisma } from '../db'
import { sendEmail } from '../services/email.service'

new Worker(
  'email-send',
  async (job) => {
    const { leadId, draftId, type, followUpDraftId } = job.data

    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    const draft = await prisma.emailDraft.findUnique({ where: { id: draftId } })

    if (!lead || !draft) {
      throw new Error('Lead or draft not found')
    }

    await sendEmail(lead.email, draft.subject, draft.body)

    await prisma.emailSend.create({
      data: {
        leadId,
        type,
        provider: 'resend',
        status: 'SENT',
        sentAt: new Date()
      }
    })

    // schedule follow-up with CORRECT draft
    if (type === 'INITIAL' && followUpDraftId) {
      await emailQueue.add(
        'send-follow-up',
        {
          leadId,
          draftId: followUpDraftId,
          type: 'FOLLOW_UP'
        },
        {
          // delay: 2 * 24 * 60 * 60 * 1000 // 2 days
          delay: 10 * 1000 // 10 seconds for testing
        }
      )
    }

    return { success: true }
  },
  { connection: redisConnection }
)

