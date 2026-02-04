// import { PrismaClient } from '@prisma/client'
// export const prisma = new PrismaClient()

import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
})