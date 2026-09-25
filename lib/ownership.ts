import { db } from '@/lib/db'

// Los dados de baja (activo = false) se tratan como si no existieran
export async function getComplexByOwner(complexId: string, ownerId: string) {
  return db.complejo.findFirst({
    where: { id: complexId, duenioId: ownerId, activo: true },
  })
}

export async function getCourtWithComplex(courtId: string) {
  return db.cancha.findFirst({
    where: { id: courtId, activo: true, complejo: { activo: true } },
    include: { complejo: true },
  })
}

export async function getBlockWithComplex(blockId: string) {
  return db.block.findFirst({
    where: { id: blockId, court: { activo: true, complejo: { activo: true } } },
    include: { court: { include: { complejo: true } } },
  })
}
