import Link from 'next/link'
import { ArrowUpRight, Ban, Flame, Lightbulb, Wallet } from 'lucide-react'
import { nombresCortosDeDias } from '@/lib/labels'
import type { CeldaDeDemanda } from '@/lib/dashboard'
import { AnimatedNumber } from '@/components/animated-number'
import { VariationBadge } from '@/components/variation-badge'

// Los cuatro datos que más le sirven al dueño después de la ocupación:
// cuánto ganó, cuánto perdió, cuándo se llena y qué horario conviene mover.
// "vidrio": adentro del bloque verde (sobre el degradé). "tarjeta": abajo.

type Variante = 'vidrio' | 'tarjeta'

const claseDeLaVariante: Record<Variante, string> = {
  vidrio:
    'border-hero-line/25 bg-hero-line/10 text-hero-line rounded-2xl border p-4 backdrop-blur-md',
  tarjeta:
    'border-border bg-card rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md',
}

const claseDelIcono: Record<Variante, string> = {
  vidrio: 'bg-hero-line/15 flex size-8 shrink-0 items-center justify-center rounded-lg',
  tarjeta: 'bg-acento/10 text-acento flex size-8 shrink-0 items-center justify-center rounded-lg',
}

const claseSecundaria: Record<Variante, string> = {
  vidrio: 'text-sm opacity-80',
  tarjeta: 'text-muted-foreground text-sm',
}

function Encabezado({
  icono: Icono,
  texto,
  variante,
}: {
  icono: typeof Wallet
  texto: string
  variante: Variante
}) {
  return (
    <p
      className={`flex items-center gap-2 font-medium whitespace-nowrap ${claseSecundaria[variante]}`}
    >
      <span className={claseDelIcono[variante]}>
        <Icono className="size-4" />
      </span>
      {texto}
    </p>
  )
}

export function KpiTiles({
  variante,
  ingresos,
  variacionIngresos,
  cancelaciones,
  noShows,
  variacionPerdidos,
  horarioPico,
  horarioAImpulsar,
  hrefParaImpulsar,
}: {
  variante: Variante
  ingresos: number
  variacionIngresos: number | null
  cancelaciones: number
  noShows: number
  variacionPerdidos: number | null
  horarioPico: CeldaDeDemanda | null
  horarioAImpulsar: CeldaDeDemanda | null
  hrefParaImpulsar: string
}) {
  const enVidrio = variante === 'vidrio'
  // En pantallas chicas, una por fila: así los montos y textos entran enteros
  const columnas = enVidrio
    ? 'grid-cols-1 sm:grid-cols-2'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className={`grid gap-3 ${columnas}`}>
      <div className={claseDeLaVariante[variante]}>
        <Encabezado icono={Wallet} texto="Ingresos" variante={variante} />
        <p className="mt-3 truncate text-2xl font-semibold tracking-tight sm:text-3xl">
          <AnimatedNumber valor={ingresos} tipo="precio" />
        </p>
        <div className="mt-1.5">
          <VariationBadge
            variacion={variacionIngresos}
            subirEsBueno={true}
            enFondoDeColor={enVidrio}
          />
        </div>
      </div>

      <div className={claseDeLaVariante[variante]}>
        <Encabezado icono={Ban} texto="Turnos perdidos" variante={variante} />
        <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          <AnimatedNumber valor={cancelaciones + noShows} />
        </p>
        <p className={`mt-1.5 truncate ${claseSecundaria[variante]}`}>
          {cancelaciones} cancelados · {noShows} ausentes
        </p>
        <div className="mt-1.5">
          {/* Menos turnos perdidos es mejor: subir es malo */}
          <VariationBadge
            variacion={variacionPerdidos}
            subirEsBueno={false}
            enFondoDeColor={enVidrio}
          />
        </div>
      </div>

      <div className={claseDeLaVariante[variante]}>
        <Encabezado icono={Flame} texto="Horario pico" variante={variante} />
        <p className="mt-3 text-2xl font-semibold tracking-tight whitespace-nowrap sm:text-3xl">
          {horarioPico
            ? `${nombresCortosDeDias[horarioPico.diaSemana]} ${horarioPico.horaInicio}`
            : '—'}
        </p>
        <p className={`mt-1.5 truncate ${claseSecundaria[variante]}`}>
          {horarioPico ? `${horarioPico.reservas} reservas` : 'Sin reservas'}
        </p>
      </div>

      <Link
        href={hrefParaImpulsar}
        title="El horario con menos reservas: un precio especial más bajo puede llenarlo"
        className={`${claseDeLaVariante[variante]} group ${enVidrio ? 'hover:bg-hero-line/20 transition-colors' : ''}`}
      >
        <div className="flex items-center justify-between gap-2">
          <Encabezado icono={Lightbulb} texto="A impulsar" variante={variante} />
          <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight whitespace-nowrap sm:text-3xl">
          {horarioAImpulsar
            ? `${nombresCortosDeDias[horarioAImpulsar.diaSemana]} ${horarioAImpulsar.horaInicio}`
            : '—'}
        </p>
        <p className={`mt-1.5 truncate ${claseSecundaria[variante]}`}>Probá un precio especial</p>
      </Link>
    </div>
  )
}
