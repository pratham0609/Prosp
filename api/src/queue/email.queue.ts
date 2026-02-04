import { Queue } from 'bullmq'
import { redisConnection } from './redis'

export const EMAIL_QUEUE_NAME = 'email-send'
export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
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
