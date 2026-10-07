'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Vista } from '@/lib/periodos'

const claseFlecha =
  'text-muted-foreground hover:bg-muted hover:text-foreground flex size-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-30'

// Mismo aspecto que los demás selects de la barra
export const claseSelectDeLaBarra =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-card h-9 min-w-0 rounded-full border px-3 text-sm font-medium outline-none focus-visible:ring-3'

// Barra de filtros de una sola fila, como la de un calendario:
// [Hoy] ‹ ›  Octubre de 2026            [complejo ▾] [Mes ▾]
// Las flechas van al período anterior o al siguiente; no se puede pasar del
// actual (no hay datos del futuro). selectorDeComplejo va a la derecha, junto
// al de día/semana/mes.
export function PeriodPicker({
  vista,
  titulo,
  rango,
  esElActual,
  selectorDeComplejo,
  alIrAlAnterior,
  alIrAlSiguiente,
  alVolverAHoy,
  alCambiarLaVista,
}: {
  vista: Vista
  titulo: string
  rango: string
  esElActual: boolean
  selectorDeComplejo: React.ReactNode
  alIrAlAnterior: () => void
  alIrAlSiguiente: () => void
  alVolverAHoy: () => void
  alCambiarLaVista: (vista: Vista) => void
}) {
  return (
    <div className="border-border bg-card flex flex-wrap items-center gap-x-2 gap-y-2 rounded-2xl border p-2 shadow-sm">
      <button
        type="button"
        onClick={alVolverAHoy}
        className={
          esElActual
            ? 'border-acento/40 text-acento h-9 shrink-0 rounded-full border px-4 text-sm font-semibold'
            : 'border-border hover:bg-muted h-9 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors'
        }
      >
        Hoy
      </button>
      <div className="flex shrink-0 items-center">
        <button
          type="button"
          aria-label="Período anterior"
          onClick={alIrAlAnterior}
          className={claseFlecha}
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Período siguiente"
          onClick={alIrAlSiguiente}
          disabled={esElActual}
          className={claseFlecha}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="min-w-0 flex-1 px-1" aria-live="polite">
        <p className="text-base leading-tight font-semibold sm:text-lg">{titulo}</p>
        {rango !== '' && <p className="text-muted-foreground text-sm leading-tight">{rango}</p>}
      </div>

      {/* En mobile bajan a su propia fila, a todo el ancho */}
      <div className="flex w-full gap-2 sm:w-auto">
        <div className="min-w-0 flex-1 sm:flex-none">{selectorDeComplejo}</div>
        <select
          key={vista}
          aria-label="Ver por"
          defaultValue={vista}
          onChange={(e) => alCambiarLaVista(e.target.value as Vista)}
          className={`${claseSelectDeLaBarra} shrink-0`}
        >
          <option value="dia">Día</option>
          <option value="semana">Semana</option>
          <option value="mes">Mes</option>
        </select>
      </div>
    </div>
  )
}
