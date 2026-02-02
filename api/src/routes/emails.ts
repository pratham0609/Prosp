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

  const initialDraft = await prisma.emailDraft.findFirst({
    where: { leadId },
    orderBy: { createdAt: 'asc' }
  })
  if (!initialDraft) throw new Error('No initial draft found')

  // create FOLLOW-UP draft
  const followUpDraft = await prisma.emailDraft.create({
    data: {
      leadId,
      subject: `Following up, ${lead.firstName}`,
      body: `
Hi ${lead.firstName},

Just wanted to follow up on my previous message.
Let me know if this makes sense to discuss.

Best,
Ruchi
      `.trim()
    }
  })

  // enqueue INITIAL email
  await emailQueue.add('send-initial', {
    leadId,
    draftId: initialDraft.id,
    type: 'INITIAL',
    followUpDraftId: followUpDraft.id
  })

  return {
    queued: true,
    followUpScheduledInDays: 2
  }
})

}
