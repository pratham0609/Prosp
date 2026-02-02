import { FastifyInstance } from 'fastify'
import { prisma } from '../db'
import { emailQueue } from '../queue/email.queue'

export default async function (app: FastifyInstance) {
  app.post('/send/:leadId', async (req) => {
  const { leadId } = req.params as any

  const draft = await prisma.emailDraft.findFirst({
    where: { leadId }
  })

  if (!draft) throw new Error('No draft found')

  await emailQueue.add('send-email', {
    leadId,
    draftId: draft.id
  })

  return { queued: true }
})
}
