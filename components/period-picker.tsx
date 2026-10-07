'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { VistaDelSelector } from '@/lib/periodos'

const claseFlecha =
  'text-muted-foreground hover:bg-muted hover:text-foreground flex size-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-30'

const claseFecha =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-card h-9 min-w-0 flex-1 rounded-full border px-3 text-sm font-medium outline-none focus-visible:ring-3'

const claseOpcion =
  'h-7 flex-1 rounded-full px-3 text-sm font-medium whitespace-nowrap transition-colors'

const vistas: { vista: VistaDelSelector; nombre: string }[] = [
  { vista: 'dia', nombre: 'Día' },
  { vista: 'semana', nombre: 'Semana' },
  { vista: 'mes', nombre: 'Mes' },
  { vista: 'rango', nombre: 'Rango' },
]

// Barra del tiempo, como la de un calendario.
// En pantallas grandes, una sola fila:
//   [Hoy] ‹ ›  Octubre de 2026          [fechas] [Día|Semana|Mes|Rango]
// En el celular:
//   ‹      Octubre de 2026      ›
//   [Hoy] [Día|Semana|Mes|Rango]
//   [fechas]  (solo con "Rango")
// El orden cambia con las clases order-*. Con "Rango" las flechas corren el
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
            ? 'border-acento/40 text-acento order-5 h-9 shrink-0 rounded-full border px-4 text-sm font-semibold sm:order-1'
            : 'border-border hover:bg-muted order-5 h-9 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors sm:order-1'
        }
      >
        Hoy
      </button>
      <button
        type="button"
        aria-label="Período anterior"
        onClick={alIrAlAnterior}
        className={`${claseFlecha} order-1 sm:order-2`}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Período siguiente"
        onClick={alIrAlSiguiente}
        disabled={esElActual}
        className={`${claseFlecha} order-3`}
      >
        <ChevronRight className="size-5" />
      </button>

      <div
        className="order-2 min-w-0 flex-1 px-1 text-center sm:order-4 sm:text-left"
        aria-live="polite"
      >
        <p className="text-base leading-tight font-semibold sm:text-lg">{titulo}</p>
        {subtitulo !== '' && (
          <p className="text-muted-foreground text-sm leading-tight">{subtitulo}</p>
        )}
      </div>

      {/* En el celular corta la fila: lo que sigue va abajo */}
      <div className="order-4 basis-full sm:hidden" />

      {rango && (
        // key: si el rango cambia con las flechas, los campos se vuelven a armar
        <div
          key={`${rango.desde}-${rango.hasta}`}
          className="order-7 flex w-full items-center gap-1.5 sm:order-5 sm:w-auto"
        >
          <input
            type="date"
            aria-label="Desde"
            defaultValue={rango.desde}
            max={rango.hasta}
            onChange={(e) => {
              if (e.target.value !== '') alCambiarElRango(e.target.value, rango.hasta)
            }}
            className={claseFecha}
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
            className={claseFecha}
          />
        </div>
      )}

      <div
        className="bg-muted order-6 flex min-w-0 flex-1 rounded-full p-1 sm:flex-none"
        role="group"
        aria-label="Ver por"
      >
        {vistas.map((opcion) => (
          <button
            key={opcion.vista}
            type="button"
            aria-pressed={opcion.vista === vista}
            onClick={() => alCambiarLaVista(opcion.vista)}
            className={
              opcion.vista === vista
                ? `${claseOpcion} bg-card text-acento shadow-sm`
                : `${claseOpcion} text-muted-foreground hover:text-foreground`
            }
          >
            {opcion.nombre}
          </button>
        ))}
      </div>
    </div>
  )
}
