import type { EstadoReserva } from '@/lib/generated/prisma/client'
import { formatPrecio } from '@/lib/labels'

// Lo mínimo de una reserva que hace falta para armar su tarjeta del historial.
// Los montos llegan como string (Decimal.toString()) para no depender de Prisma.
type ReservaDelHistorial = {
  estado: EstadoReserva
  asistio: boolean | null
  precioTurno: string
  pago: { monto: string; porcentaje: number; devuelto: boolean } | null
}

export type MontoDelHistorial = {
  etiqueta: string
  monto: string
  detalle?: string
  tono: 'normal' | 'exito' | 'peligro'
}

// Cada tarjeta muestra un solo monto principal, el que importa según el
// momento de la reserva:
// - cancelada: qué pasó con la seña (el precio del turno ya no importa)
// - no se presentó: la seña, que es lo único que llegó a cobrarse
// - ya jugada: el total del turno
// - por jugar: lo que falta pagar en el complejo, con la seña como detalle
export function montoDelHistorial(
  reserva: ReservaDelHistorial,
  yaPaso: boolean,
  rol: 'JUGADOR' | 'DUENIO',
): MontoDelHistorial | null {
  const { estado, asistio, precioTurno, pago } = reserva
  const esJugador = rol === 'JUGADOR'

  if (estado === 'CANCELADA') {
    // Reservas de antes de que existiera la seña: no hay nada que mostrar.
    if (!pago) return null
    return pago.devuelto
      ? { etiqueta: 'Seña devuelta', monto: formatPrecio(pago.monto), tono: 'exito' }
      : { etiqueta: 'Seña no devuelta', monto: formatPrecio(pago.monto), tono: 'peligro' }
  }

  if (asistio === false) {
    // No se presentó: el complejo se quedó con la seña y nunca cobró el resto.
    if (!pago) return null
    return {
      etiqueta: esJugador ? 'Seña perdida' : 'Seña retenida',
      monto: formatPrecio(pago.monto),
      tono: 'peligro',
    }
  }

  if (estado === 'PENDIENTE') {
    // Nunca se pagó la seña: si el turno ya empezó no hay nada que mostrar.
    if (yaPaso) return null
    return {
      etiqueta: 'Precio del turno',
      monto: formatPrecio(precioTurno),
      detalle: esJugador ? 'Pagá la seña para confirmar' : 'Esperando la seña',
      tono: 'normal',
    }
  }

  if (yaPaso) {
    return {
      etiqueta: esJugador ? 'Total del turno' : 'Total cobrado',
      monto: formatPrecio(precioTurno),
      tono: 'normal',
    }
  }

  const resta = Number(precioTurno) - Number(pago?.monto ?? 0)
  return {
    etiqueta: esJugador ? 'Pagás en el complejo' : 'A cobrar en el complejo',
    monto: formatPrecio(resta),
    detalle: pago
      ? `${esJugador ? 'Seña pagada' : 'Seña cobrada'} ${formatPrecio(pago.monto)} de ${formatPrecio(precioTurno)}`
      : undefined,
    tono: 'normal',
  }
}
