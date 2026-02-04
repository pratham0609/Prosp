import { FastifyInstance } from 'fastify'
// import { prisma } from '../db'
import { emailQueue } from '../queue/email.queue'
import { generateEmail } from '../services/ai.service'
import { getPrisma } from '../db'

const prisma = getPrisma()


export default async function (app: FastifyInstance) {

app.post('/send/:leadId', async (req) => {
  const { leadId } = req.params as any

  const lead = await prisma.lead.findUnique({ where: { id: leadId } })
  if (!lead) throw new Error('Lead not found')

  // 1. Find existing initial draft
  let initialDraft = await prisma.emailDraft.findFirst({
    where: { leadId },
    orderBy: { createdAt: 'asc' }
  })

  // 2. If no draft exists, generate one
  if (!initialDraft) {
    const { subject, body } = await generateEmail(lead)

    initialDraft = await prisma.emailDraft.create({
      data: {
        leadId,
        subject,
        body
      }
    })
  }

  // 3. Create follow-up draft
  const followUpDraft = await prisma.emailDraft.create({
    data: {
      leadId,
      subject: `Following up, ${lead.firstName}`,
      body: `
Hi ${lead.firstName},

Just wanted to follow up on my previous message.
Let me know if this makes sense to discuss.

Best,
Prosp
      `.trim()
    }
  })

  // 4. Enqueue initial email
  await emailQueue.add('send-initial', {
    leadId,
    draftId: initialDraft.id,
    followUpDraftId: followUpDraft.id,
    type: 'INITIAL'
  })

  return { queued: true }
})

}
