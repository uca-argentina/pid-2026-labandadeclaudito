'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deporteLabels } from '@/lib/labels'
import { urlDelDashboard, type FiltrosDelDashboard } from '@/lib/dashboard'
import type { Deporte } from '@/lib/generated/prisma/client'
import { PeriodPicker } from '@/components/period-picker'
import { SportIcon } from '@/components/sport-icon'

// Mismo aspecto que el Input de shadcn (igual al de zona-filter.tsx)
const selectClassName =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-card h-12 rounded-xl border px-3 text-base shadow-sm outline-none focus-visible:ring-3'

const claseChip =
  'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-base font-medium whitespace-nowrap transition-colors'
const claseChipActivo = `${claseChip} bg-acento text-acento-foreground border-acento shadow-sm`
const claseChipInactivo = `${claseChip} bg-card border-border hover:bg-muted`

// Lo que hace falta para el selector de período (lo calcula la página)
export type DatosDelPeriodo = {
  nombre: string
  rango: string
  esElActual: boolean
  fechaAnterior: string
  fechaSiguiente: string
}

// Los filtros de arriba (complejo, período, deporte) y, abajo, el contenido
// del dashboard (children). Cambiar un filtro navega sin recargar la página
// (router.push): los números, el anillo y las barras pasan del valor viejo al
// nuevo con una transición. Mientras llegan los datos nuevos, el contenido se
// ve más tenue. En pantallas grandes la barra de filtros queda fija arriba al
// bajar, para saber siempre qué se está mirando.
export function DashboardFrame({
  complejos,
  deportes,
  filtros,
  periodo,
  children,
}: {
  complejos: { id: string; nombre: string }[]
  deportes: Deporte[]
  filtros: FiltrosDelDashboard
  periodo: DatosDelPeriodo
  children: React.ReactNode
}) {
  const router = useRouter()
  const [cargando, startTransition] = useTransition()

  function navegar(nuevosFiltros: FiltrosDelDashboard) {
    startTransition(() => {
      router.push(urlDelDashboard(nuevosFiltros), { scroll: false })
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-background/85 border-border/60 -mx-6 space-y-3 border-b px-6 py-3 backdrop-blur-md md:sticky md:top-0 md:z-30">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {/* key: si el complejo cambia desde otro lado (el ranking "Por
              complejo"), el select se vuelve a armar y muestra el nuevo */}
          <select
            key={filtros.complejoId ?? 'todos'}
            aria-label="Complejo"
            defaultValue={filtros.complejoId ?? ''}
            // Otro complejo puede no tener el deporte elegido: vuelve a "Todos".
            // El valor vacío es "Todos los complejos".
            onChange={(e) =>
              navegar({ ...filtros, complejoId: e.target.value || undefined, deporte: undefined })
            }
            className={`${selectClassName} w-full sm:w-auto`}
          >
            <option value="">Todos los complejos</option>
            {complejos.map((complejo) => (
              <option key={complejo.id} value={complejo.id}>
                {complejo.nombre}
              </option>
            ))}
          </select>

          <PeriodPicker
            vista={filtros.vista}
            nombre={periodo.nombre}
            rango={periodo.rango}
            esElActual={periodo.esElActual}
            alIrAlAnterior={() => navegar({ ...filtros, fecha: periodo.fechaAnterior })}
            alIrAlSiguiente={() => navegar({ ...filtros, fecha: periodo.fechaSiguiente })}
            alVolverAHoy={() => navegar({ ...filtros, fecha: undefined })}
            // Se queda en la misma fecha: de "Hoy" a "Mes" muestra este mes
            alCambiarLaVista={(vista) => navegar({ ...filtros, vista })}
          />
        </div>

        {/* Con un solo deporte no hay nada que elegir */}
        {deportes.length > 1 && (
          <div className="-mx-6 overflow-x-auto px-6 pb-1 [contain:inline-size]">
            <div className="flex gap-2" role="group" aria-label="Deporte">
              <button
                type="button"
                aria-pressed={filtros.deporte === undefined}
                onClick={() => navegar({ ...filtros, deporte: undefined })}
                className={filtros.deporte === undefined ? claseChipActivo : claseChipInactivo}
              >
                Todos
              </button>
              {deportes.map((unDeporte) => (
                <button
                  key={unDeporte}
                  type="button"
                  aria-pressed={filtros.deporte === unDeporte}
                  onClick={() => navegar({ ...filtros, deporte: unDeporte })}
                  className={filtros.deporte === unDeporte ? claseChipActivo : claseChipInactivo}
                >
                  <SportIcon deporte={unDeporte} className="size-6" />
                  {deporteLabels[unDeporte]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        aria-busy={cargando}
        className={cargando ? 'opacity-60 transition-opacity' : 'transition-opacity'}
      >
        {children}
      </div>
    </div>
  )
}
