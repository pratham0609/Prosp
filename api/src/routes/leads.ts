import { FastifyInstance } from 'fastify'
import { prisma } from '../db'

export default async function (app: FastifyInstance) {
  app.post('/', async (req) => {
    const body = req.body as any

    const existing = await prisma.lead.findUnique({
      where: { email: body.email }
    })

    if (existing) {
      return existing
    }

    return prisma.lead.create({ data: body })
  })

  app.get('/', async () => {
    return prisma.lead.findMany({
      include: { drafts: true }
    })
  })
  
  app.post('/:id/reply', async (req) => {
  const { id } = req.params as any
  return prisma.lead.update({
    where: { id },
    data: {
      repliedAt: new Date(),
      status: 'EMAIL_SENT'}
    })
  })
}
