'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deporteLabels } from '@/lib/labels'
import { urlDelDashboard, type FiltrosDelDashboard } from '@/lib/dashboard'
import type { Deporte } from '@/lib/generated/prisma/client'
import { claseSelectDeLaBarra, PeriodPicker } from '@/components/period-picker'
import { SportIcon } from '@/components/sport-icon'

const claseChip =
  'inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors'
const claseChipActivo = `${claseChip} bg-acento text-acento-foreground border-acento shadow-sm`
const claseChipInactivo = `${claseChip} bg-card border-border hover:bg-muted`

// Lo que hace falta para el selector de período (lo calcula la página)
export type DatosDelPeriodo = {
  titulo: string
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
    <div className="space-y-5">
      <div className="bg-background/85 -mx-6 space-y-2 px-6 py-2 backdrop-blur-md md:sticky md:top-0 md:z-30">
        <PeriodPicker
          vista={filtros.vista}
          titulo={periodo.titulo}
          rango={periodo.rango}
          esElActual={periodo.esElActual}
          alIrAlAnterior={() => navegar({ ...filtros, fecha: periodo.fechaAnterior })}
          alIrAlSiguiente={() => navegar({ ...filtros, fecha: periodo.fechaSiguiente })}
          alVolverAHoy={() => navegar({ ...filtros, fecha: undefined })}
          // Se queda en la misma fecha: de "Día" a "Mes" muestra el mes de ese día
          alCambiarLaVista={(vista) => navegar({ ...filtros, vista })}
          selectorDeComplejo={
            // key: si el complejo cambia desde otro lado (el ranking "Por
            // complejo"), el select se vuelve a armar y muestra el nuevo
            <select
              key={filtros.complejoId ?? 'todos'}
              aria-label="Complejo"
              defaultValue={filtros.complejoId ?? ''}
              // Otro complejo puede no tener el deporte elegido: vuelve a "Todos".
              // El valor vacío es "Todos los complejos".
              onChange={(e) =>
                navegar({ ...filtros, complejoId: e.target.value || undefined, deporte: undefined })
              }
              className={`${claseSelectDeLaBarra} w-full sm:w-auto sm:max-w-56`}
            >
              <option value="">Todos los complejos</option>
              {complejos.map((complejo) => (
                <option key={complejo.id} value={complejo.id}>
                  {complejo.nombre}
                </option>
              ))}
            </select>
          }
        />

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
                  <SportIcon deporte={unDeporte} className="size-5" />
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
