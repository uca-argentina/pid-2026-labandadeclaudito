import type { Deporte, TipoSuperficie } from '@/lib/generated/prisma/client'

export const deporteLabels: Record<Deporte, string> = {
  FUTBOL_5: 'Fútbol 5',
  FUTBOL_7: 'Fútbol 7',
  FUTBOL_11: 'Fútbol 11',
}

export const superficieLabels: Record<TipoSuperficie, string> = {
  CESPED_SINTETICO: 'Césped sintético',
  CESPED_NATURAL: 'Césped natural',
  CEMENTO: 'Cemento',
  PARQUET: 'Parquet',
}

export function formatPrecio(precio: number | string): string {
  return `$${Number(precio).toLocaleString('es-AR')}`
}
