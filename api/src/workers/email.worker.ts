import { Worker } from 'bullmq'
import { redisConnection } from '../queue/redis'
import { prisma } from '../db'
import { sendEmail } from '../services/email.service'

new Worker(
  'email-send',
  async (job) => {
    const { leadId, draftId } = job.data

    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    const draft = await prisma.emailDraft.findUnique({ where: { id: draftId } })

    if (!lead || !draft) {
      throw new Error('Lead or draft not found')
    }

    await sendEmail(lead.email, draft.subject, draft.body)

    await prisma.emailSend.create({
      data: {
        leadId,
        type: 'INITIAL',
        provider: 'resend',
        status: 'SENT',
        sentAt: new Date()
      }
    })

    return { success: true }
  },
  { connection: redisConnection }
)
