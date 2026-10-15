import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/lib/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// Abrir una conexión nueva a la base cuesta ~1 s (la base está en la nube) y
// usarla ya abierta ~150 ms. Por defecto pg cierra las conexiones a los 10 s
// sin uso: alcanzaba con mirar una página un rato para que la siguiente acción
// (abrir el sheet de reservar, por ejemplo) pagara ese segundo de nuevo.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  idleTimeoutMillis: 5 * 60 * 1000,
})

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
