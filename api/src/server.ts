import Fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'
import { prisma } from './db'
import leadRoutes from './routes/leads'
import emailRoutes from './routes/emails'

dotenv.config()

const app = Fastify({ logger: true })

app.register(cors)
app.register(leadRoutes, { prefix: '/leads' })
app.register(emailRoutes, { prefix: '/emails' })

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`API running on port ${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}


start()
