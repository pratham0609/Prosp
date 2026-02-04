import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

process.on('SIGTERM', async () => {
  if (prisma) {
    await prisma.$disconnect()
  }
})
