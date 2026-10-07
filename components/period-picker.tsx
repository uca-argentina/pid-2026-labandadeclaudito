'use client'

import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import type { Vista } from '@/lib/periodos'

const nombreDeLaVista: Record<Vista, string> = { dia: 'Día', semana: 'Semana', mes: 'Mes' }
const vistas: Vista[] = ['dia', 'semana', 'mes']

const claseFlecha =
  'text-muted-foreground hover:bg-muted hover:text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-30'

const claseVista =
  'rounded-md px-3 py-1.5 text-base font-medium whitespace-nowrap transition-colors'

// Selector de período: flechas para ir al anterior o al siguiente, el nombre
// del período al medio ("Hoy", "Esta semana", "Septiembre 2026") y al lado si
// se mira por día, semana o mes. No se puede pasar del período actual: no hay
// datos del futuro.
export function PeriodPicker({
  vista,
  nombre,
  rango,
  esElActual,
  alIrAlAnterior,
  alIrAlSiguiente,
  alVolverAHoy,
  alCambiarLaVista,
}: {
  vista: Vista
  nombre: string
  rango: string
  esElActual: boolean
  alIrAlAnterior: () => void
  alIrAlSiguiente: () => void
  alVolverAHoy: () => void
  alCambiarLaVista: (vista: Vista) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="border-border bg-card flex items-center rounded-xl border p-1 shadow-sm">
        <button
          type="button"
          aria-label="Período anterior"
          onClick={alIrAlAnterior}
          className={claseFlecha}
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="min-w-36 px-2 text-center" aria-live="polite">
          <p className="text-base leading-tight font-semibold whitespace-nowrap">{nombre}</p>
          <p className="text-muted-foreground text-sm whitespace-nowrap">{rango}</p>
        </div>
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

      <div className="bg-muted flex rounded-lg p-1" role="group" aria-label="Ver por">
        {vistas.map((unaVista) => (
          <button
            key={unaVista}
            type="button"
            aria-pressed={unaVista === vista}
            onClick={() => alCambiarLaVista(unaVista)}
            className={
              unaVista === vista
                ? `${claseVista} bg-card text-acento shadow-sm`
                : `${claseVista} text-muted-foreground hover:text-foreground`
            }
          >
            {nombreDeLaVista[unaVista]}
          </button>
        ))}
      </div>

      {!esElActual && (
        <button
          type="button"
          onClick={alVolverAHoy}
          className="text-acento hover:bg-acento/10 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-base font-medium whitespace-nowrap transition-colors"
        >
          <RotateCcw className="size-4" />
          Volver a hoy
        </button>
      )}
    </div>
  )
}
