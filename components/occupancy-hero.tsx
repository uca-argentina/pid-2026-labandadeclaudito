import Link from 'next/link'
import { ArrowUpRight, Flame, Lightbulb } from 'lucide-react'
import { nombresCortosDeDias } from '@/lib/labels'
import type { CeldaDeDemanda, FamiliaDeDeporte } from '@/lib/dashboard'
import { AnimatedNumber } from '@/components/animated-number'
import { CourtIllustration } from '@/components/court-illustration'
import { ProgressRing } from '@/components/progress-ring'
import { VariationBadge } from '@/components/variation-badge'

// Vidrio esmerilado sobre el degradé (como las tarjetas de la referencia oscura)
const vidrio = 'border-hero-line/25 bg-hero-line/10 rounded-2xl border backdrop-blur-md'

export function OccupancyHero({
  porcentaje,
  turnosReservados,
  turnosOfrecidos,
  variacionTurnos,
  horarioEstrella,
  horarioAImpulsar,
  familia,
  familiasDelComplejo,
  complejoId,
}: {
  porcentaje: number
  turnosReservados: number
  turnosOfrecidos: number
  variacionTurnos: number | null
  horarioEstrella: CeldaDeDemanda | null
  horarioAImpulsar: CeldaDeDemanda | null
  familia: FamiliaDeDeporte | undefined
  familiasDelComplejo: FamiliaDeDeporte[]
  complejoId: string
}) {
  return (
    <section className="from-tema-desde to-tema-hasta text-hero-line relative overflow-hidden rounded-3xl bg-linear-to-br shadow-lg">
      {/* Luces difusas que suavizan el degradé */}
      <div className="bg-hero-line/20 pointer-events-none absolute -top-32 -left-24 size-96 rounded-full blur-3xl" />
      <div className="bg-tema-desde pointer-events-none absolute -right-20 -bottom-40 size-[28rem] rounded-full opacity-70 blur-3xl" />

      <div className="relative grid items-center gap-6 p-6 md:grid-cols-2 md:p-8">
        <div className="space-y-4">
          <div className={`${vidrio} flex flex-wrap items-center gap-6 p-5`}>
            <ProgressRing
              porcentaje={porcentaje}
              className="size-36"
              claseFondo="stroke-hero-line/20"
              claseRelleno="stroke-hero-line"
            >
              <span className="text-4xl font-semibold tracking-tight">
                <AnimatedNumber valor={porcentaje} tipo="porcentaje" />
              </span>
              <span className="text-sm whitespace-nowrap opacity-80">ocupación</span>
            </ProgressRing>

            <div className="space-y-2">
              <p className="text-base whitespace-nowrap opacity-80">Turnos reservados</p>
              <p className="text-3xl font-semibold tracking-tight whitespace-nowrap">
                <AnimatedNumber valor={turnosReservados} />
                <span className="text-lg font-normal opacity-70">
                  {' '}
                  de {turnosOfrecidos.toLocaleString('es-AR')}
                </span>
              </p>
              <VariationBadge variacion={variacionTurnos} subirEsBueno={true} enFondoDeColor />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {horarioEstrella && (
              <div
                title={`El horario con más reservas: ${horarioEstrella.reservas}`}
                className={`${vidrio} flex items-center gap-3 px-4 py-3`}
              >
                <Flame className="size-5 shrink-0 motion-safe:animate-pulse" />
                <div className="whitespace-nowrap">
                  <p className="text-sm opacity-80">Horario pico</p>
                  <p className="text-lg font-semibold">
                    {nombresCortosDeDias[horarioEstrella.diaSemana]} {horarioEstrella.horaInicio}
                  </p>
                </div>
              </div>
            )}
            {horarioAImpulsar && (
              <Link
                href={`/dueno/complejos/${complejoId}`}
                title="El horario con menos reservas: un precio especial más bajo puede llenarlo"
                className={`${vidrio} hover:bg-hero-line/20 group flex items-center gap-3 px-4 py-3 transition-colors`}
              >
                <Lightbulb className="size-5 shrink-0" />
                <div className="whitespace-nowrap">
                  <p className="text-sm opacity-80">A impulsar</p>
                  <p className="text-lg font-semibold">
                    {nombresCortosDeDias[horarioAImpulsar.diaSemana]} {horarioAImpulsar.horaInicio}
                  </p>
                </div>
                <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}
          </div>
        </div>

        {/* En mobile la ilustración va arriba de los números */}
        <div className="order-first md:order-none">
          <CourtIllustration familia={familia} familiasDelComplejo={familiasDelComplejo} />
        </div>
      </div>
    </section>
  )
}
