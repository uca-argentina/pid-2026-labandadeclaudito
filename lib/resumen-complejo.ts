import type { Deporte } from '@/lib/generated/prisma/client'

// Datos de resumen de un complejo a partir de sus canchas. Los usan la
// búsqueda (tarjeta de cada complejo) y el detalle (ficha del costado).

export function deportesDistintos(canchas: { deporte: Deporte }[]): Deporte[] {
  const deportes: Deporte[] = []
  for (const cancha of canchas) {
    if (!deportes.includes(cancha.deporte)) {
      deportes.push(cancha.deporte)
    }
  }
  return deportes
}

// null si no hay canchas: en el detalle puede pasar que ninguna cumpla los
// filtros de la búsqueda.
export function precioMasBajo(canchas: { priceFrom: number }[]): number | null {
  if (canchas.length === 0) {
    return null
  }
  let minimo = canchas[0].priceFrom
  for (const cancha of canchas) {
    if (cancha.priceFrom < minimo) {
      minimo = cancha.priceFrom
    }
  }
  return minimo
}
