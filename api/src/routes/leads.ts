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
}
