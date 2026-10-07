import Link from 'next/link'
import { ChevronRight, Trophy } from 'lucide-react'
import { formatPrecio } from '@/lib/labels'
import type { Deporte } from '@/lib/generated/prisma/client'
import { claseTarjetaDeDatos } from '@/components/data-card'
import { ProgressRing } from '@/components/progress-ring'
import { SportIcon } from '@/components/sport-icon'

export type FilaDeComplejo = {
  id: string
  nombre: string
  deportes: Deporte[]
  porcentaje: number
  turnosReservados: number
  ingresos: number
  href: string
}

// Ranking de los complejos del dueño por ocupación (vienen ordenados de mayor a
// menor). Tocar uno muestra el dashboard de ese complejo.
export function ComplexBreakdown({ filas }: { filas: FilaDeComplejo[] }) {
  return (
    <section className={`${claseTarjetaDeDatos} p-4 sm:p-5`}>
      <h2 className="mb-4 text-xl font-semibold">Por complejo</h2>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filas.map((fila, posicion) => (
          <li key={fila.id}>
            <Link
              href={fila.href}
              scroll={false}
              className="border-border bg-background/60 hover:bg-muted hover:border-acento/30 group flex h-full items-center gap-3 rounded-xl border p-3 transition-colors"
            >
              <span
                className={
                  posicion === 0
                    ? 'bg-acento text-acento-foreground flex size-9 shrink-0 items-center justify-center rounded-full'
                    : 'bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-base font-semibold'
                }
              >
                {posicion === 0 ? <Trophy className="size-4" /> : posicion + 1}
              </span>

              <div className="min-w-0 flex-1 space-y-1">
                <p className="line-clamp-2 text-lg leading-snug font-semibold">{fila.nombre}</p>
                <div className="flex items-center gap-1.5">
                  {fila.deportes.map((deporte) => (
                    <SportIcon key={deporte} deporte={deporte} className="size-6" />
                  ))}
                </div>
                {/* Si no entra en una línea, baja el dato entero (no se corta) */}
                <p className="text-muted-foreground flex flex-wrap gap-x-2 text-sm">
                  <span className="whitespace-nowrap">{formatPrecio(fila.ingresos)}</span>
                  <span className="whitespace-nowrap">
                    {fila.turnosReservados.toLocaleString('es-AR')} turnos
                  </span>
                </p>
              </div>

              <ProgressRing
                porcentaje={fila.porcentaje}
                className="size-14"
                claseFondo="stroke-muted"
                claseRelleno="stroke-acento"
              >
                <span className="text-sm font-semibold">{fila.porcentaje}%</span>
              </ProgressRing>
              <ChevronRight className="text-muted-foreground hidden size-5 shrink-0 transition-transform group-hover:translate-x-1 sm:block" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
