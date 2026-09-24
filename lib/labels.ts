import type { Deporte, EstadoReserva, TipoSuperficie } from '@/lib/generated/prisma/client'

export const deporteLabels: Record<Deporte, string> = {
  FUTBOL_5: 'Fútbol 5',
  FUTBOL_7: 'Fútbol 7',
  FUTBOL_11: 'Fútbol 11',
  TENIS: 'Tenis',
  PADEL: 'Pádel',
}

export const superficieLabels: Record<TipoSuperficie, string> = {
  CESPED_SINTETICO: 'Césped sintético',
  CESPED_NATURAL: 'Césped natural',
  CEMENTO: 'Cemento',
  PARQUET: 'Parquet',
  POLVO_DE_LADRILLO: 'Polvo de ladrillo',
}

// Combinaciones deporte/superficie que tienen sentido en la realidad
// (ej: fútbol nunca se juega en polvo de ladrillo, eso es de tenis).
export const superficiesPorDeporte: Record<Deporte, TipoSuperficie[]> = {
  FUTBOL_5: ['CESPED_SINTETICO', 'CESPED_NATURAL', 'CEMENTO'],
  FUTBOL_7: ['CESPED_SINTETICO', 'CESPED_NATURAL', 'CEMENTO'],
  FUTBOL_11: ['CESPED_SINTETICO', 'CESPED_NATURAL', 'CEMENTO'],
  TENIS: ['POLVO_DE_LADRILLO', 'CESPED_NATURAL', 'CEMENTO', 'PARQUET'],
  PADEL: ['CESPED_SINTETICO', 'CEMENTO', 'PARQUET'],
}

export const estadoReservaLabels: Record<EstadoReserva, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
  NO_SHOW: 'No se presentó',
  COMPLETADA: 'Completada',
}

export function formatPrecio(precio: number | string): string {
  return `$${Number(precio).toLocaleString('es-AR')}`
}
