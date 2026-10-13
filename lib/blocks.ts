import { db } from '@/lib/db'
import { pendientesVencidas } from '@/lib/bookings'
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

// Un turno que termina a medianoche se guarda con horaFin "00:00", que como
// texto es menor que cualquier hora: para comparar hay que leerlo como "24:00".
function finDeDia(hora: string): string {
  return hora === '00:00' ? '24:00' : hora
}

export function blockOverlapsBooking(
  block: BlockRange,
  booking: { date: string; startTime: string; endTime: string },
): boolean {
  const dateInRange = booking.date >= block.startDate && booking.date <= block.endDate
  const bookingEndTime = finDeDia(booking.endTime)
  const timesOverlap = block.startTime < bookingEndTime && booking.startTime < block.endTime
  return dateInRange && timesOverlap
}

// Un turno está bloqueado si su horario se cruza con el de algún bloqueo que
// ya cae en el día consultado (el filtro por fecha lo hace quien llama).
export function isSlotBlocked(
  horaInicio: string,
  horaFin: string,
  blocks: { startTime: string; endTime: string }[],
): boolean {
  const horaFinComparable = finDeDia(horaFin)

  for (const block of blocks) {
    if (block.startTime < horaFinComparable && horaInicio < block.endTime) {
      return true
    }
  }
  return false
}

// Los horarios bloqueados de una cancha en un día puntual.
export async function getBlocksOfDay(courtId: string, fecha: Date) {
  return db.block.findMany({
    where: { courtId, startDate: { lte: fecha }, endDate: { gte: fecha } },
    select: { startTime: true, endTime: true },
  })
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
      NOT: pendientesVencidas(),
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

// Los bloqueos de varias canchas que caen en un día, en una sola consulta.
// Los usan los listados (búsqueda, detalle del complejo, pantallas del dueño)
// para mostrar en gris las canchas bloqueadas.
export async function bloqueosDelDia(idsDeCanchas: string[], fecha: Date) {
  return db.block.findMany({
    where: { courtId: { in: idsDeCanchas }, startDate: { lte: fecha }, endDate: { gte: fecha } },
    select: { courtId: true, startTime: true, endTime: true, reason: true },
    orderBy: { startTime: 'asc' },
  })
}

// "Bloqueada de 14:00 a 18:00", y con el motivo si lo ve el dueño. El motivo
// es una nota interna: al jugador no se le muestra nunca.
export function textoDelBloqueo(
  bloqueos: { startTime: string; endTime: string; reason: string | null }[],
  conMotivo: boolean,
): string {
  const franjas: string[] = []
  const motivos: string[] = []
  for (const bloqueo of bloqueos) {
    franjas.push(`de ${bloqueo.startTime} a ${bloqueo.endTime}`)
    if (bloqueo.reason) {
      motivos.push(bloqueo.reason)
    }
  }

  let texto = `Bloqueada ${franjas.join(' y ')}`
  if (conMotivo && motivos.length > 0) {
    texto += ` · ${motivos.join(', ')}`
  }
  return texto
}

// Para la card de un complejo: cuántas de sus canchas están bloqueadas.
export function resumenBloqueosDelComplejo(bloqueadas: number, total: number): string | null {
  if (bloqueadas === 0) {
    return null
  }
  if (bloqueadas === total) {
    return 'Todas las canchas bloqueadas'
  }
  if (bloqueadas === 1) {
    return `1 de ${total} canchas bloqueada`
  }
  return `${bloqueadas} de ${total} canchas bloqueadas`
}
