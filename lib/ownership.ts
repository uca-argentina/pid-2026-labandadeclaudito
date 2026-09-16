import { db } from '@/lib/db'

export async function getComplexByOwner(complexId: string, ownerId: string) {
  return db.complejo.findFirst({
    where: { id: complexId, duenioId: ownerId },
  })
}

export async function getCourtWithComplex(courtId: string) {
  return db.cancha.findUnique({
    where: { id: courtId },
    include: { complejo: true },
  })
}
