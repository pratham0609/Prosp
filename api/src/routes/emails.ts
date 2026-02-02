import { FastifyInstance } from 'fastify'
import { prisma } from '../db'
import { emailQueue } from '../queue/email.queue'

function buildFollowUpDraft(lead: any) {
  return {
    subject: `Following up, ${lead.firstName}`,
    body: `
Hi ${lead.firstName},

Just wanted to follow up on my previous message.
Let me know if this is worth a quick chat.

Best,
Ruchi
    `.trim()
  }
}


export default async function (app: FastifyInstance) {

  app.post('/send/:leadId', async (req) => {
  const { leadId } = req.params as any

  const lead = await prisma.lead.findUnique({ where: { id: leadId } })
  if (!lead) throw new Error('Lead not found')

  const draft = await prisma.emailDraft.findFirst({ where: { leadId } })
  if (!draft) throw new Error('No draft found')

  // Create follow-up draft now (so worker has it later)
  const followUp = buildFollowUpDraft(lead)
  const followUpDraft = await prisma.emailDraft.create({
    data: {
      leadId,
      subject: followUp.subject,
      body: followUp.body
    }
  })

  await emailQueue.add('send-initial', {
    leadId,
    draftId: draft.id,
    type: 'INITIAL'
  })

  return {
    queued: true,
    followUpScheduledInDays: 2 // kept 1 min for testing
  }
})

}
