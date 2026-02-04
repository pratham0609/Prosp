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

app.get('/', async (req, reply) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    })
    reply.send(leads)
  } catch (err) {
    req.log.error(err)
    reply.status(500).send({ error: 'Failed to fetch leads' })
  }
})

  
app.post('/', async (req, reply) => {
  try {
    const body = req.body as any

    const existing = await prisma.lead.findUnique({
      where: { email: body.email }
    })

    if (existing) {
      return reply.status(409).send({ error: 'Lead already exists' })
    }

    const lead = await prisma.lead.create({ data: body })
    reply.send(lead)
  } catch (err) {
    req.log.error(err)
    reply.status(500).send({ error: 'Failed to create lead' })
  }
})

}
