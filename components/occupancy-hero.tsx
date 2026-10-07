import { Building2 } from 'lucide-react'
import { deporteLabels, formatoDeJuego } from '@/lib/labels'
import type { Deporte } from '@/lib/generated/prisma/client'
import { AnimatedNumber } from '@/components/animated-number'
import { CourtIllustration } from '@/components/court-illustration'
import { claseTarjetaDeDatos } from '@/components/data-card'
import { ProgressRing } from '@/components/progress-ring'
import { SportIcon } from '@/components/sport-icon'
import { VariationBadge } from '@/components/variation-badge'

// El bloque principal: un degradé del color del deporte con los datos en
// tarjetas sólidas encima. Lo primero que ve el dueño es la ocupación (la
// métrica que dice si las canchas trabajan). Al lado:
// - sin deporte elegido: los datos clave (resumen)
// - con un deporte: su cancha ilustrada; los datos clave van abajo del bloque
export function OccupancyHero({
  alcance,
  periodo,
  comparacion,
  porcentaje,
  turnosReservados,
  turnosOfrecidos,
  variacionTurnos,
  deporte,
  resumen,
}: {
  alcance: string
  periodo: string
  comparacion: string
  porcentaje: number
  turnosReservados: number
  turnosOfrecidos: number
  variacionTurnos: number | null
  deporte: Deporte | undefined
  resumen: React.ReactNode
}) {
  return (
    <section className="from-tema-desde to-tema-hasta text-hero-line relative overflow-hidden rounded-2xl bg-linear-to-br shadow-lg">
      {/* Luces difusas que suavizan el degradé */}
      <div className="bg-hero-line/20 pointer-events-none absolute -top-32 -left-24 size-96 rounded-full blur-3xl" />
      <div className="bg-tema-desde pointer-events-none absolute -right-20 -bottom-40 size-112 rounded-full opacity-70 blur-3xl" />

      {/* El resumen necesita más ancho que la cancha para no cortar los montos:
          va en dos columnas recién desde lg */}
      <div className="relative grid grid-cols-1 items-center gap-4 p-4 sm:p-5 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="bg-hero-line/15 inline-flex max-w-full items-center gap-2 rounded-xl px-2.5 py-1 text-sm font-medium">
            {deporte ? (
              <SportIcon deporte={deporte} className="size-5" />
            ) : (
              <Building2 className="size-4 shrink-0" />
            )}
            {/* Si no entra, baja de línea (no se corta) */}
            <span>
              {alcance} · {deporte ? deporteLabels[deporte] : 'Todos los deportes'} · {periodo}
            </span>
          </p>

          <div className={`${claseTarjetaDeDatos} flex items-center gap-4 p-4`}>
            <ProgressRing
              porcentaje={porcentaje}
              className="size-24 sm:size-28"
              claseFondo="stroke-acento/15"
              claseRelleno="stroke-acento"
            >
              <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
                <AnimatedNumber valor={porcentaje} tipo="porcentaje" />
              </span>
              <span className="text-muted-foreground text-xs whitespace-nowrap sm:text-sm">
                ocupación
              </span>
            </ProgressRing>

            <div className="min-w-0 space-y-1.5">
              <p className="text-muted-foreground text-sm whitespace-nowrap">Turnos reservados</p>
              <p className="text-2xl font-semibold tracking-tight whitespace-nowrap">
                <AnimatedNumber valor={turnosReservados} />
                <span className="text-muted-foreground text-base font-normal">
                  {' '}
                  de {turnosOfrecidos.toLocaleString('es-AR')}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <VariationBadge variacion={variacionTurnos} subirEsBueno={true} />
                <span className="text-muted-foreground text-sm whitespace-nowrap">
                  vs. {comparacion}
                </span>
              </div>
            </div>
          </div>
        </div>

        {deporte === undefined ? (
          resumen
        ) : (
          // En mobile la cancha va arriba de los números
          <div className="relative order-first mx-auto w-full max-w-60 sm:max-w-sm lg:order-0 lg:max-w-md">
            <CourtIllustration deporte={deporte} />
            <p
              className={`${claseTarjetaDeDatos} absolute right-2 bottom-0 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold whitespace-nowrap`}
            >
              <SportIcon deporte={deporte} className="size-5" />
              {formatoDeJuego[deporte]}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
