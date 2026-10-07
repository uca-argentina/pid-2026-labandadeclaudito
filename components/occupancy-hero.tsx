import { Building2 } from 'lucide-react'
import { deporteLabels, formatoDeJuego } from '@/lib/labels'
import type { FamiliaDeDeporte } from '@/lib/dashboard'
import type { Deporte } from '@/lib/generated/prisma/client'
import { AnimatedNumber } from '@/components/animated-number'
import { CourtIllustration, FloatingBalls } from '@/components/court-illustration'
import { claseTarjetaDeDatos } from '@/components/data-card'
import { ProgressRing } from '@/components/progress-ring'
import { SportIcon } from '@/components/sport-icon'
import { VariationBadge } from '@/components/variation-badge'

// El bloque principal: un degradé del color del deporte con los datos en
// tarjetas sólidas encima. Lo primero que ve el dueño es la ocupación (la
// métrica que dice si las canchas trabajan). Al lado:
// - sin deporte elegido: los datos clave (resumen), con las pelotas de fondo
// - con un deporte: su cancha ilustrada; los datos clave van abajo del bloque
export function OccupancyHero({
  alcance,
  porcentaje,
  turnosReservados,
  turnosOfrecidos,
  variacionTurnos,
  deporte,
  familias,
  resumen,
}: {
  alcance: string
  porcentaje: number
  turnosReservados: number
  turnosOfrecidos: number
  variacionTurnos: number | null
  deporte: Deporte | undefined
  familias: FamiliaDeDeporte[]
  resumen: React.ReactNode
}) {
  return (
    <section className="from-tema-desde to-tema-hasta text-hero-line relative overflow-hidden rounded-3xl bg-linear-to-br shadow-lg">
      {/* Luces difusas que suavizan el degradé */}
      <div className="bg-hero-line/20 pointer-events-none absolute -top-32 -left-24 size-96 rounded-full blur-3xl" />
      <div className="bg-tema-desde pointer-events-none absolute -right-20 -bottom-40 size-112 rounded-full opacity-70 blur-3xl" />
      {deporte === undefined && (
        <div className="pointer-events-none absolute -right-10 -bottom-16 hidden h-80 w-120 opacity-15 lg:block">
          <FloatingBalls familias={familias} />
        </div>
      )}

      {/* El resumen necesita más ancho que la cancha para no cortar los montos:
          va en dos columnas recién desde xl */}
      <div
        className={
          deporte === undefined
            ? 'relative grid items-center gap-6 p-6 md:p-8 xl:grid-cols-2'
            : 'relative grid items-center gap-6 p-6 md:p-8 lg:grid-cols-2'
        }
      >
        <div className="space-y-4">
          <p className="bg-hero-line/15 inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
            {deporte ? (
              <SportIcon deporte={deporte} className="size-5" />
            ) : (
              <Building2 className="size-4 shrink-0" />
            )}
            <span className="truncate">
              {alcance} · {deporte ? deporteLabels[deporte] : 'Todos los deportes'}
            </span>
          </p>

          <div className={`${claseTarjetaDeDatos} flex flex-wrap items-center gap-6 p-5`}>
            <ProgressRing
              porcentaje={porcentaje}
              className="size-36"
              claseFondo="stroke-acento/15"
              claseRelleno="stroke-acento"
            >
              <span className="text-4xl font-semibold tracking-tight">
                <AnimatedNumber valor={porcentaje} tipo="porcentaje" />
              </span>
              <span className="text-muted-foreground text-sm whitespace-nowrap">ocupación</span>
            </ProgressRing>

            <div className="space-y-2">
              <p className="text-muted-foreground text-base whitespace-nowrap">Turnos reservados</p>
              <p className="text-3xl font-semibold tracking-tight whitespace-nowrap">
                <AnimatedNumber valor={turnosReservados} />
                <span className="text-muted-foreground text-lg font-normal">
                  {' '}
                  de {turnosOfrecidos.toLocaleString('es-AR')}
                </span>
              </p>
              <VariationBadge variacion={variacionTurnos} subirEsBueno={true} />
            </div>
          </div>
        </div>

        {deporte === undefined ? (
          resumen
        ) : (
          // En mobile la cancha va arriba de los números
          <div className="relative order-first lg:order-0">
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
