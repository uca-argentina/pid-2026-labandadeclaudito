import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Building2 } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { diaDeHoy, formatearDia, sumarDias } from '@/lib/time'
import {
  familiaDelDeporte,
  horarioMasPedido,
  horarioMenosPedido,
  porcentaje,
  reservasPorDia,
  temaDelDeporte,
  variacionPorcentual,
  type FamiliaDeDeporte,
} from '@/lib/dashboard'
import { dashboardFiltersSchema } from '@/lib/validations/dashboard'
import type { Deporte } from '@/lib/generated/prisma/client'
import { DashboardFrame } from '@/components/dashboard-frame'
import { DemandPanel } from '@/components/demand-panel'
import { IncomeCard, LossesCard } from '@/components/kpi-card'
import { OccupancyHero } from '@/components/occupancy-hero'
import { SportBreakdown, type FilaDeDeporte } from '@/components/sport-breakdown'
import { WeekStrip } from '@/components/week-strip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Forma acordada con SCRUM-62. Cuando entre lib/metricas-complejo.ts, este
// tipo y metricasDePrueba se borran y se usa
// metricasDelComplejo(complejoId, desde, hasta, deporte). OJO: el parámetro
// deporte (opcional, undefined = todos) hay que pedírselo a Franco.
type MetricasComplejo = {
  ocupacion: { turnosReservados: number; turnosOfrecidos: number; porcentaje: number }
  ingresos: number
  cancelaciones: number
  noShows: number
  demanda: { diaSemana: number; horaInicio: string; reservas: number }[]
}

const pesoDePrueba: Record<Deporte, number> = {
  FUTBOL_5: 0.9,
  FUTBOL_7: 0.7,
  FUTBOL_11: 0.5,
  TENIS: 0.6,
  PADEL: 1,
  BASQUET: 0.4,
}

// factor: para que el período anterior dé números distintos y se vea la variación
function metricasDePrueba(dias: number, factor: number, deporte?: Deporte): MetricasComplejo {
  const peso = deporte === undefined ? 1 : pesoDePrueba[deporte]
  const demanda: { diaSemana: number; horaInicio: string; reservas: number }[] = []
  for (let diaSemana = 0; diaSemana < 7; diaSemana++) {
    for (let hora = 9; hora <= 23; hora++) {
      let reservas = 1
      if (hora >= 18) reservas += 3
      if (hora >= 20 && hora <= 22) reservas += 2
      if (diaSemana === 5 || diaSemana === 6) reservas += 2
      if (diaSemana === 2 && hora < 12) reservas = 0
      demanda.push({
        diaSemana,
        horaInicio: `${String(hora).padStart(2, '0')}:00`,
        reservas: Math.round(((reservas * dias) / 7) * factor * peso),
      })
    }
  }

  const turnosOfrecidos = 15 * dias
  const turnosReservados = Math.round(9 * dias * factor * peso)
  return {
    ocupacion: {
      turnosReservados,
      turnosOfrecidos,
      porcentaje: porcentaje(turnosReservados, turnosOfrecidos),
    },
    ingresos: Math.round(4500 * dias * factor * peso),
    cancelaciones: Math.round((dias / 3) * factor * peso),
    noShows: Math.round((dias / 7) * factor * peso),
    demanda,
  }
}

function urlDelDashboard(complejoId: string, dias: number, deporte: Deporte) {
  return `/dueno/dashboard?complejoId=${complejoId}&dias=${dias}&deporte=${deporte}`
}

export default async function DashboardDuenioPage({ searchParams }: PageProps<'/dueno/dashboard'>) {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.rol !== 'DUENIO') redirect('/jugador')

  const filtros = dashboardFiltersSchema.parse(await searchParams)

  // Solo los complejos del dueño logueado: si en la URL viene el id de uno
  // ajeno, no está en esta lista y se muestra el primero propio.
  const complejos = await db.complejo.findMany({
    where: { duenioId: session.user.id, activo: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: 'asc' },
  })

  if (complejos.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-6 pt-6 pb-12 md:pt-4">
        <h1 className="mb-6 text-3xl font-semibold">Estadísticas</h1>
        <div className="border-border bg-card rounded-2xl border p-10 text-center">
          <Building2 className="text-muted-foreground mx-auto mb-4 size-8" />
          <p className="font-medium">Todavía no tenés complejos</p>
          <p className="text-muted-foreground mt-1.5 mb-5 text-sm">
            Cargá tu primer complejo para ver cómo se reservan tus canchas.
          </p>
          <Button render={<Link href="/dueno/complejos/nuevo" />}>Nuevo complejo</Button>
        </div>
      </div>
    )
  }

  let complejoElegido = complejos[0]
  for (const complejo of complejos) {
    if (complejo.id === filtros.complejoId) {
      complejoElegido = complejo
    }
  }

  // Los deportes que tiene el complejo (de sus canchas activas). Si en la URL
  // viene uno que no tiene, se muestran todos.
  const canchasPorDeporte = await db.cancha.findMany({
    where: { complejoId: complejoElegido.id, activo: true },
    distinct: ['deporte'],
    select: { deporte: true },
    orderBy: { deporte: 'asc' },
  })
  const deportes: Deporte[] = []
  for (const cancha of canchasPorDeporte) {
    deportes.push(cancha.deporte)
  }
  let deporte: Deporte | undefined = undefined
  if (filtros.deporte !== undefined && deportes.includes(filtros.deporte)) {
    deporte = filtros.deporte
  }

  // El período termina hoy: "últimos 7 días" es hoy y los 6 anteriores. El
  // anterior es el mismo largo justo antes, para comparar.
  const hasta = diaDeHoy()
  const desde = sumarDias(hasta, -(filtros.dias - 1))
  const metricas = metricasDePrueba(filtros.dias, 1, deporte)
  const anteriores = metricasDePrueba(filtros.dias, 0.9, deporte)

  const { turnosReservados, turnosOfrecidos } = metricas.ocupacion

  // Con "Todos" y más de un deporte, cómo le va a cada uno
  const filasPorDeporte: FilaDeDeporte[] = []
  if (deporte === undefined && deportes.length > 1) {
    for (const unDeporte of deportes) {
      const delDeporte = metricasDePrueba(filtros.dias, 1, unDeporte)
      filasPorDeporte.push({
        deporte: unDeporte,
        porcentaje: delDeporte.ocupacion.porcentaje,
        turnosReservados: delDeporte.ocupacion.turnosReservados,
        ingresos: delDeporte.ingresos,
        href: urlDelDashboard(complejoElegido.id, filtros.dias, unDeporte),
      })
    }
  }

  const familiasDelComplejo: FamiliaDeDeporte[] = []
  for (const unDeporte of deportes) {
    const familia = familiaDelDeporte(unDeporte)
    if (!familiasDelComplejo.includes(familia)) {
      familiasDelComplejo.push(familia)
    }
  }

  return (
    // El tema pinta todo lo de adentro con los colores del deporte elegido
    <div
      className={`${temaDelDeporte(deporte)} mx-auto w-full max-w-5xl space-y-6 px-6 pt-6 pb-12 md:pt-4`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold">Estadísticas</h1>
          <Badge variant="outline">Datos de ejemplo</Badge>
        </div>
        <p className="text-muted-foreground mt-1 text-base">
          {formatearDia(desde)} al {formatearDia(hasta)}
        </p>
      </div>

      <DashboardFrame
        complejos={complejos}
        deportes={deportes}
        complejoId={complejoElegido.id}
        dias={filtros.dias}
        deporte={deporte}
      >
        <div className="space-y-6">
          <OccupancyHero
            porcentaje={metricas.ocupacion.porcentaje}
            turnosReservados={turnosReservados}
            turnosOfrecidos={turnosOfrecidos}
            variacionTurnos={variacionPorcentual(
              turnosReservados,
              anteriores.ocupacion.turnosReservados,
            )}
            horarioEstrella={horarioMasPedido(metricas.demanda)}
            horarioAImpulsar={horarioMenosPedido(metricas.demanda)}
            familia={deporte === undefined ? undefined : familiaDelDeporte(deporte)}
            familiasDelComplejo={familiasDelComplejo}
            complejoId={complejoElegido.id}
          />

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Reservas por día</h2>
            <WeekStrip totalesPorDia={reservasPorDia(metricas.demanda)} />
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            <IncomeCard
              ingresos={metricas.ingresos}
              ingresosAnteriores={anteriores.ingresos}
              variacion={variacionPorcentual(metricas.ingresos, anteriores.ingresos)}
            />
            <LossesCard
              cancelaciones={metricas.cancelaciones}
              tasaCancelaciones={porcentaje(
                metricas.cancelaciones,
                turnosReservados + metricas.cancelaciones,
              )}
              variacionCancelaciones={variacionPorcentual(
                metricas.cancelaciones,
                anteriores.cancelaciones,
              )}
              noShows={metricas.noShows}
              tasaNoShows={porcentaje(metricas.noShows, turnosReservados)}
              variacionNoShows={variacionPorcentual(metricas.noShows, anteriores.noShows)}
            />
          </div>

          {filasPorDeporte.length > 0 && <SportBreakdown filas={filasPorDeporte} />}

          <DemandPanel demanda={metricas.demanda} demandaAnterior={anteriores.demanda} />
        </div>
      </DashboardFrame>
    </div>
  )
}
