import { Queue } from 'bullmq'
import { redisConnection } from './redis'

export const emailQueue = new Queue('email-send', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
})
