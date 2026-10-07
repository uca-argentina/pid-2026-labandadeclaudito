import { Gauge } from 'lucide-react'
import { formatoDeJuego } from '@/lib/labels'
import type { Deporte } from '@/lib/generated/prisma/client'
import { AnimatedNumber } from '@/components/animated-number'
import { CourtIllustration } from '@/components/court-illustration'
import { claseTarjetaDeDatos } from '@/components/data-card'
import { ProgressRing } from '@/components/progress-ring'
import { SportIcon } from '@/components/sport-icon'
import { VariationBadge } from '@/components/variation-badge'

// El bloque principal: un degradé del color del deporte con los datos en
// tarjetas sólidas encima. Arriba, las pestañas para elegir el deporte (es lo
// que cambia este bloque). Lo primero que ve el dueño es la ocupación (la
// métrica que dice si las canchas trabajan). Al lado:
// - sin deporte elegido: los datos clave (resumen)
// - con un deporte: su cancha ilustrada; los datos clave van abajo del bloque
export function OccupancyHero({
  pestanas,
  comparacion,
  porcentaje,
  turnosReservados,
  turnosOfrecidos,
  variacionTurnos,
  deporte,
  resumen,
}: {
  // null cuando hay un solo deporte: no hay nada que elegir
  pestanas: React.ReactNode
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

      <div className="relative space-y-4 p-4 sm:p-5">
        {pestanas}

        {/* En dos columnas recién desde xl: antes no entran montos grandes
            (un rango largo llega a 8 cifras) sin cortarse. La cancha, que no
            tiene montos, ya entra desde lg. */}
        <div
          className={
            deporte === undefined
              ? 'grid grid-cols-1 items-stretch gap-4 xl:grid-cols-2'
              : 'grid grid-cols-1 items-center gap-4 lg:grid-cols-2'
          }
        >
          {/* Tarjeta vertical: el anillo grande al centro, abajo los turnos
              reservados y libres (con un punto del color de su parte del
              anillo, como leyenda) y al pie cuánto cambió. Ocupa todo el alto
              del bloque, a la par de los datos clave. */}
          <div
            className={`${claseTarjetaDeDatos} flex h-full flex-col items-center gap-4 p-4 text-center sm:p-5`}
          >
            <p className="text-muted-foreground flex items-center gap-2 self-start text-sm font-medium">
              <span className="bg-acento/10 text-acento flex size-7 items-center justify-center rounded-lg">
                <Gauge className="size-4" />
              </span>
              Ocupación
            </p>

            <ProgressRing
              porcentaje={porcentaje}
              className="size-36 sm:size-40"
              claseFondo="stroke-acento/15"
              claseRelleno="stroke-acento"
            >
              <span className="text-4xl font-semibold tracking-tight">
                <AnimatedNumber valor={porcentaje} tipo="porcentaje" />
              </span>
              <span className="text-muted-foreground text-sm">de los turnos</span>
            </ProgressRing>

            <div className="divide-border grid w-full grid-cols-2 divide-x">
              <div>
                <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-sm">
                  <span className="bg-acento size-2.5 shrink-0 rounded-full" />
                  Reservados
                </p>
                <p className="text-2xl font-semibold tracking-tight">
                  <AnimatedNumber valor={turnosReservados} />
                </p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-sm">
                  <span className="bg-acento/20 size-2.5 shrink-0 rounded-full" />
                  Libres
                </p>
                <p className="text-2xl font-semibold tracking-tight">
                  <AnimatedNumber valor={turnosOfrecidos - turnosReservados} />
                </p>
              </div>
            </div>

            <div className="border-border mt-auto flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t pt-3">
              <VariationBadge variacion={variacionTurnos} subirEsBueno={true} />
              <span className="text-muted-foreground text-sm">vs. {comparacion}</span>
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
      </div>
    </section>
  )
}
