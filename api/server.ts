import Fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'
import { prisma } from './src/db'
import leadRoutes from './src/routes/leads'
import emailRoutes from './src/routes/emails'

dotenv.config()

const app = Fastify({ logger: true })

app.register(cors)
app.register(leadRoutes, { prefix: '/leads' })
app.register(emailRoutes, { prefix: '/emails' })

const start = async () => {
  try {
    await app.listen({ port: 3001 })
    console.log('API running on http://localhost:3001')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
