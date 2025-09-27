import { PrismaClient } from '@prisma/client';

type GlobalPrisma = {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as unknown as GlobalPrisma;

function createPrismaClient() {
  return new PrismaClient();
}

export function getPrisma() {
  if (process.env.NODE_ENV !== 'production') {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }

    return globalForPrisma.prisma;
  }

  return createPrismaClient();
}
