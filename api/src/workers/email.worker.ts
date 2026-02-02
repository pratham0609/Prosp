import { Worker, Queue } from 'bullmq'
import { redisConnection } from '../queue/redis'
const emailQueue = new Queue('email-send', { connection: redisConnection })
import { prisma } from '../db'
import { sendEmail } from '../services/email.service'

new Worker(
  'email-send',
  async (job) => {
    const { leadId, draftId, type } = job.data

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

    // 👉 Schedule follow-up after INITIAL email
    if (type === 'INITIAL') {
      await emailQueue.add(
        'send-follow-up',
        {
          leadId,
          draftId,
          type: 'FOLLOW_UP'
        },
        {
          // delay: 2 * 24 * 60 * 60 * 1000 // 2 days
          // delay: 60 * 60 * 1000 // 1 hr
          delay: 60 * 1000 // 1 min
        }
      )
    }

    return { success: true }
  },
  { connection: redisConnection }
)
