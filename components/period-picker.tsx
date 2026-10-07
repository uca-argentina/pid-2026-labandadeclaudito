'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { VistaDelSelector } from '@/lib/periodos'

const claseFlecha =
  'text-muted-foreground hover:bg-muted hover:text-foreground flex size-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-30'

// Mismo aspecto para los selects y campos de la barra
export const claseCampoDeLaBarra =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-card h-9 min-w-0 rounded-full border px-3 text-sm font-medium outline-none focus-visible:ring-3'

// Barra del tiempo, de una sola fila como la de un calendario:
// [Hoy] ‹ ›  Octubre de 2026                    [Mes ▾]
// Con "Rango" aparecen dos fechas (desde y hasta) y las flechas corren el
// rango por su largo. No se puede pasar de hoy: no hay datos del futuro.
export function PeriodPicker({
  vista,
  titulo,
  subtitulo,
  esElActual,
  rango,
  alIrAlAnterior,
  alIrAlSiguiente,
  alVolverAHoy,
  alCambiarLaVista,
  alCambiarElRango,
}: {
  vista: VistaDelSelector
  titulo: string
  subtitulo: string
  esElActual: boolean
  // Solo con vista 'rango'; hoy es el máximo que se puede elegir
  rango: { desde: string; hasta: string; hoy: string } | null
  alIrAlAnterior: () => void
  alIrAlSiguiente: () => void
  alVolverAHoy: () => void
  alCambiarLaVista: (vista: VistaDelSelector) => void
  alCambiarElRango: (desde: string, hasta: string) => void
}) {
  return (
    <div className="border-border bg-card flex flex-wrap items-center gap-2 rounded-2xl border p-2 shadow-sm">
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
        {subtitulo !== '' && (
          <p className="text-muted-foreground text-sm leading-tight">{subtitulo}</p>
        )}
      </div>

      {/* En mobile bajan a su propia fila, a todo el ancho */}
      <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
        {rango && (
          // key: si el rango cambia con las flechas, los campos se vuelven a armar
          <div
            key={`${rango.desde}-${rango.hasta}`}
            className="flex w-full min-w-0 items-center gap-1.5 sm:w-auto"
          >
            <input
              type="date"
              aria-label="Desde"
              defaultValue={rango.desde}
              max={rango.hasta}
              onChange={(e) => {
                if (e.target.value !== '') alCambiarElRango(e.target.value, rango.hasta)
              }}
              className={`${claseCampoDeLaBarra} flex-1`}
            />
            <span className="text-muted-foreground text-sm">a</span>
            <input
              type="date"
              aria-label="Hasta"
              defaultValue={rango.hasta}
              min={rango.desde}
              max={rango.hoy}
              onChange={(e) => {
                if (e.target.value !== '') alCambiarElRango(rango.desde, e.target.value)
              }}
              className={`${claseCampoDeLaBarra} flex-1`}
            />
          </div>
        )}
        <select
          key={vista}
          aria-label="Ver por"
          defaultValue={vista}
          onChange={(e) => alCambiarLaVista(e.target.value as VistaDelSelector)}
          className={`${claseCampoDeLaBarra} w-full shrink-0 sm:w-auto`}
        >
          <option value="dia">Día</option>
          <option value="semana">Semana</option>
          <option value="mes">Mes</option>
          <option value="rango">Rango</option>
        </select>
      </div>
    </div>
  )
}
