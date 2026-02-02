import { FastifyInstance } from 'fastify'
import { prisma } from '../db'
import { generateEmail } from '../services/ai.service'
import { sendEmail } from '../services/email.service'

export default async function (app: FastifyInstance) {
  app.post('/generate/:leadId', async (req) => {
    const { leadId } = req.params as any
    const lead = await prisma.lead.findUnique({ where: { id: leadId } })

    if (!lead) throw new Error('Lead not found')

    const { subject, body } = await generateEmail(lead)

    return prisma.emailDraft.create({
      data: { leadId, subject, body }
    })
  })

  app.post('/send/:leadId', async (req) => {
    const { leadId } = req.params as any

    const draft = await prisma.emailDraft.findFirst({
      where: { leadId }
    })

    if (!draft) throw new Error('No draft found')

    await sendEmail(
      (await prisma.lead.findUnique({ where: { id: leadId } }))!.email,
      draft.subject,
      draft.body
    )

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
  })
}
