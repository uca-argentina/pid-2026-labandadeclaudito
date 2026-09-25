import { db } from '@/lib/db'
import { diaDeReserva } from '@/lib/time'

export type BlockRange = {
  startDate: string
  endDate: string
  startTime: string
  endTime: string
}

// Dos bloqueos se solapan si sus rangos de fecha se cruzan Y el horario
// (que se repite todos los días del rango) también se cruza.
export function blocksOverlap(a: BlockRange, b: BlockRange): boolean {
  const datesOverlap = a.startDate <= b.endDate && b.startDate <= a.endDate
  const timesOverlap = a.startTime < b.endTime && b.startTime < a.endTime
  return datesOverlap && timesOverlap
}

export function blockOverlapsBooking(
  block: BlockRange,
  booking: { date: string; startTime: string; endTime: string },
): boolean {
  const dateInRange = booking.date >= block.startDate && booking.date <= block.endDate
  const timesOverlap = block.startTime < booking.endTime && booking.startTime < block.endTime
  return dateInRange && timesOverlap
}

// Otro bloqueo de la misma cancha cuyo rango se cruce con `range`.
// excludeId se usa al editar, para no comparar el bloqueo contra sí mismo.
export async function findOverlappingBlock(courtId: string, range: BlockRange, excludeId?: string) {
  const candidates = await db.block.findMany({
    where: {
      courtId,
      id: excludeId ? { not: excludeId } : undefined,
      startDate: { lte: new Date(range.endDate) },
      endDate: { gte: new Date(range.startDate) },
    },
  })

  const solapado = candidates.find((block) =>
    blocksOverlap(range, {
      startDate: diaDeReserva(block.startDate),
      endDate: diaDeReserva(block.endDate),
      startTime: block.startTime,
      endTime: block.endTime,
    }),
  )

  return solapado ?? null
}

// Reservas activas de la cancha que caen dentro del rango del bloqueo: son
// las que hay que cancelar al crear o editar el bloqueo.
export async function findOverlappingBookingIds(courtId: string, range: BlockRange) {
  const bookings = await db.reserva.findMany({
    where: {
      canchaId: courtId,
      estado: { not: 'CANCELADA' },
      fecha: { gte: new Date(range.startDate), lte: new Date(range.endDate) },
    },
  })

  return bookings
    .filter((booking) =>
      blockOverlapsBooking(range, {
        date: diaDeReserva(booking.fecha),
        startTime: booking.horaInicio,
        endTime: booking.horaFin,
      }),
    )
    .map((booking) => booking.id)
}
