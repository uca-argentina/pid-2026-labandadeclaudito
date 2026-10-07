import type { Deporte } from '@/lib/generated/prisma/client'
import { deporteLabels } from '@/lib/labels'

// Cada deporte con su color, para reconocerlo de un vistazo en toda la app
const colorPorDeporte: Record<Deporte, string> = {
  FUTBOL_5: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  FUTBOL_7: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  FUTBOL_11: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  TENIS: 'bg-lime-500/15 text-lime-700 dark:text-lime-300',
  PADEL: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  BASQUET: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
}

export function EtiquetaDeporte({ deporte }: { deporte: Deporte }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${colorPorDeporte[deporte]}`}
    >
      {deporteLabels[deporte]}
    </span>
  )
}
