import type { Deporte } from '@/lib/generated/prisma/client'
import { deporteLabels } from '@/lib/labels'

// Cada deporte con su color, para reconocerlo de un vistazo en toda la app
export const colorPorDeporte: Record<Deporte, string> = {
  FUTBOL_5: 'text-emerald-700 dark:text-emerald-300',
  FUTBOL_7: 'text-emerald-700 dark:text-emerald-300',
  FUTBOL_11: 'text-emerald-700 dark:text-emerald-300',
  TENIS: 'text-lime-700 dark:text-lime-300',
  PADEL: 'text-sky-700 dark:text-sky-300',
  BASQUET: 'text-orange-700 dark:text-orange-300',
}

const fondoPorDeporte: Record<Deporte, string> = {
  FUTBOL_5: 'bg-emerald-500/15',
  FUTBOL_7: 'bg-emerald-500/15',
  FUTBOL_11: 'bg-emerald-500/15',
  TENIS: 'bg-lime-500/15',
  PADEL: 'bg-sky-500/15',
  BASQUET: 'bg-orange-500/15',
}

// sobreFoto: encima de una foto el fondo translúcido no se lee, así que va
// con el fondo sólido de las tarjetas.
export function EtiquetaDeporte({
  deporte,
  sobreFoto = false,
}: {
  deporte: Deporte
  sobreFoto?: boolean
}) {
  const fondo = sobreFoto ? 'bg-card' : fondoPorDeporte[deporte]

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${fondo} ${colorPorDeporte[deporte]}`}
    >
      {deporteLabels[deporte]}
    </span>
  )
}
