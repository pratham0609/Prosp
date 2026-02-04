import dotenv from 'dotenv'
dotenv.config()
import Fastify from 'fastify'
import cors from '@fastify/cors'
import leadRoutes from './routes/leads'
import emailRoutes from './routes/emails'


const app = Fastify({ logger: true })

app.register(cors, {
  origin: [
    'http://localhost:3000',
    'https://prosp-prod.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})

app.get('/health', async (_req, reply) => {
  reply.send({ ok: true })
})

app.register(leadRoutes, { prefix: '/leads' })
app.register(emailRoutes, { prefix: '/emails' })

app.setErrorHandler((error, _req, reply) => {
  app.log.error(error)
  reply.status(500).send({
    error: 'Internal Server Error',
    message: error.message
  })
})

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
process.on('exit', (code) => {
  console.log('❌ Process exiting with code:', code)
})

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err)
})

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason)
})

setInterval(() => {
  console.log('✅ process alive', new Date().toISOString())
}, 5000)
