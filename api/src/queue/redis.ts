// import IORedis from 'ioredis'

// export const redisConnection = new IORedis({
//   // host: '127.0.0.1',
//   // port: 6379,
//   url: process.env.REDIS_URL,
//   maxRetriesPerRequest: null
// })
/////////////ABOVE FOR LOCAL TESTING, BELOW FOR DEPLOYMENT /////////////  
import { ConnectionOptions } from 'bullmq'

export const redisConnection: ConnectionOptions = {
  url: process.env.REDIS_URL
}
