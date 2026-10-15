import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/lib/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// La base (Prisma Postgres, plan gratis) acepta muy pocas conexiones a la vez:
// 10, y 5 las usa la plataforma. Las compartimos los 3 del equipo, Vercel y
// los tests. Si una sola app se queda con varias, a las demás la base les
// contesta "Failed to connect to upstream database" (y la sesión se cae).
// - max: cada app usa como mucho 2. Las consultas de un Promise.all esperan
//   su turno, pero la espera es corta (cada consulta tarda ~150 ms).
// - idleTimeoutMillis: una conexión quieta se devuelve a los 30 s, así no
//   ocupa un lugar mientras nadie la usa.
// - keepAlive: sin esto, la red corta las conexiones quietas sin avisar y la
//   siguiente consulta falla con "Connection terminated unexpectedly".
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  max: 2,
  idleTimeoutMillis: 30 * 1000,
  keepAlive: true,
})

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
