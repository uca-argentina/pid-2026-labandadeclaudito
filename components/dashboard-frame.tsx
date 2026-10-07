'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deporteLabels } from '@/lib/labels'
import type { Deporte } from '@/lib/generated/prisma/client'
import { SportBall } from '@/components/sport-ball'

// Mismo aspecto que el Input de shadcn (igual al de zona-filter.tsx)
const selectClassName =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-card h-10 rounded-lg border px-3 text-base outline-none focus-visible:ring-3'

const claseChip =
  'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-base font-medium whitespace-nowrap transition-colors'
const claseChipActivo = `${claseChip} bg-acento text-acento-foreground border-acento shadow-sm`
const claseChipInactivo = `${claseChip} bg-card border-border hover:bg-muted`

// Los filtros de arriba y, abajo, el contenido del dashboard (children).
// Cambiar un filtro navega sin recargar la página (router.push): los números,
// el anillo y las barras pasan del valor viejo al nuevo con una transición.
// Mientras llegan los datos nuevos, el contenido de abajo se ve más tenue.
export function DashboardFrame({
  complejos,
  deportes,
  complejoId,
  dias,
  deporte,
  children,
}: {
  complejos: { id: string; nombre: string }[]
  deportes: Deporte[]
  complejoId: string
  dias: number
  deporte: Deporte | undefined
  children: React.ReactNode
}) {
  const router = useRouter()
  const [cargando, startTransition] = useTransition()

  function navegar(nuevoComplejoId: string, nuevosDias: number, nuevoDeporte: Deporte | undefined) {
    const params = new URLSearchParams()
    params.set('complejoId', nuevoComplejoId)
    params.set('dias', String(nuevosDias))
    if (nuevoDeporte !== undefined) params.set('deporte', nuevoDeporte)

    startTransition(() => {
      router.push(`/dueno/dashboard?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <select
          aria-label="Complejo"
          defaultValue={complejoId}
          // Otro complejo puede no tener el deporte elegido: vuelve a "Todos"
          onChange={(e) => navegar(e.target.value, dias, undefined)}
          className={`${selectClassName} min-w-0 flex-1 sm:flex-none`}
        >
          {complejos.map((complejo) => (
            <option key={complejo.id} value={complejo.id}>
              {complejo.nombre}
            </option>
          ))}
        </select>
        <select
          aria-label="Período"
          defaultValue={String(dias)}
          onChange={(e) => navegar(complejoId, Number(e.target.value), deporte)}
          className={selectClassName}
        >
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 90 días</option>
        </select>
      </div>

      {/* Con un solo deporte no hay nada que elegir */}
      {deportes.length > 1 && (
        <div className="-mx-6 overflow-x-auto px-6 pb-1 [contain:inline-size]">
          <div className="flex gap-2" role="group" aria-label="Deporte">
            <button
              type="button"
              aria-pressed={deporte === undefined}
              onClick={() => navegar(complejoId, dias, undefined)}
              className={deporte === undefined ? claseChipActivo : claseChipInactivo}
            >
              Todos
            </button>
            {deportes.map((unDeporte) => (
              <button
                key={unDeporte}
                type="button"
                aria-pressed={deporte === unDeporte}
                onClick={() => navegar(complejoId, dias, unDeporte)}
                className={deporte === unDeporte ? claseChipActivo : claseChipInactivo}
              >
                <SportBall deporte={unDeporte} className="size-5" />
                {deporteLabels[unDeporte]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        aria-busy={cargando}
        className={cargando ? 'opacity-60 transition-opacity' : 'transition-opacity'}
      >
        {children}
      </div>
    </div>
  )
}
