import Link from 'next/link'
import { ArrowUpRight, Ban, Flame, Lightbulb, Wallet } from 'lucide-react'
import { nombresCortosDeDias } from '@/lib/labels'
import type { CeldaDeDemanda } from '@/lib/dashboard'
import { AnimatedNumber } from '@/components/animated-number'
import { claseTarjetaDeDatos, claseTarjetaInteractiva } from '@/components/data-card'
import { VariationBadge } from '@/components/variation-badge'

// Los cuatro datos que más le sirven al dueño después de la ocupación:
// cuánto ganó, cuánto perdió, cuándo se llena y qué horario conviene mover.
// "bloque": adentro del bloque principal, de a dos. "fila": abajo, los cuatro
// en una fila.

const claseTarjeta = `${claseTarjetaDeDatos} p-5`

function Encabezado({ icono: Icono, texto }: { icono: typeof Wallet; texto: string }) {
  return (
    <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium whitespace-nowrap">
      <span className="bg-acento/10 text-acento flex size-8 shrink-0 items-center justify-center rounded-lg">
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
  variante: 'bloque' | 'fila'
  ingresos: number
  variacionIngresos: number | null
  cancelaciones: number
  noShows: number
  variacionPerdidos: number | null
  horarioPico: CeldaDeDemanda | null
  horarioAImpulsar: CeldaDeDemanda | null
  hrefParaImpulsar: string
}) {
  // En pantallas chicas, una por fila: así los montos y textos entran enteros
  const columnas =
    variante === 'bloque'
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className={`grid gap-3 ${columnas}`}>
      <div className={claseTarjeta}>
        <Encabezado icono={Wallet} texto="Ingresos" />
        <p className="mt-3 truncate text-2xl font-semibold tracking-tight sm:text-3xl">
          <AnimatedNumber valor={ingresos} tipo="precio" />
        </p>
        <div className="mt-1.5">
          <VariationBadge variacion={variacionIngresos} subirEsBueno={true} />
        </div>
      </div>

      <div className={claseTarjeta}>
        <Encabezado icono={Ban} texto="Turnos perdidos" />
        <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          <AnimatedNumber valor={cancelaciones + noShows} />
        </p>
        {/* Si no entra en una línea, baja el dato entero (no se corta) */}
        <p className="text-muted-foreground mt-1.5 flex flex-wrap gap-x-1.5 text-sm">
          <span className="whitespace-nowrap">{cancelaciones} cancelados ·</span>
          <span className="whitespace-nowrap">{noShows} ausentes</span>
        </p>
        <div className="mt-1.5">
          {/* Menos turnos perdidos es mejor: subir es malo */}
          <VariationBadge variacion={variacionPerdidos} subirEsBueno={false} />
        </div>
      </div>

      <div className={claseTarjeta}>
        <Encabezado icono={Flame} texto="Horario pico" />
        <p className="mt-3 text-2xl font-semibold tracking-tight whitespace-nowrap sm:text-3xl">
          {horarioPico
            ? `${nombresCortosDeDias[horarioPico.diaSemana]} ${horarioPico.horaInicio}`
            : '—'}
        </p>
        <p className="text-muted-foreground mt-1.5 truncate text-sm">
          {horarioPico ? `${horarioPico.reservas} reservas` : 'Sin reservas'}
        </p>
      </div>

      <Link
        href={hrefParaImpulsar}
        title="El horario con menos reservas: un precio especial más bajo puede llenarlo"
        className={`${claseTarjeta} ${claseTarjetaInteractiva} group`}
      >
        <div className="flex items-center justify-between gap-2">
          <Encabezado icono={Lightbulb} texto="A impulsar" />
          <ArrowUpRight className="text-acento size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight whitespace-nowrap sm:text-3xl">
          {horarioAImpulsar
            ? `${nombresCortosDeDias[horarioAImpulsar.diaSemana]} ${horarioAImpulsar.horaInicio}`
            : '—'}
        </p>
        <p className="text-muted-foreground mt-1.5 truncate text-sm">Probá un precio especial</p>
      </Link>
    </div>
  )
}
