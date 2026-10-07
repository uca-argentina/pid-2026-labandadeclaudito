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
  sumarMetricas,
  temaDelDeporte,
  variacionPorcentual,
  type CeldaDeDemanda,
  type FamiliaDeDeporte,
  type MetricasDelPeriodo,
} from '@/lib/dashboard'
import { dashboardFiltersSchema } from '@/lib/validations/dashboard'
import type { Deporte } from '@/lib/generated/prisma/client'
import { ComplexBreakdown, type FilaDeComplejo } from '@/components/complex-breakdown'
import { DashboardFrame } from '@/components/dashboard-frame'
import { DemandPanel } from '@/components/demand-panel'
import { KpiTiles } from '@/components/kpi-tiles'
import { OccupancyHero } from '@/components/occupancy-hero'
import { SportBreakdown, type FilaDeDeporte } from '@/components/sport-breakdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// ---------- Datos de ejemplo (hasta que entre SCRUM-62) ----------
// Cuando entre lib/metricas-complejo.ts, metricasDePrueba se reemplaza por
// await metricasDelComplejo(complejo.id, desde, hasta, deporte). OJO: el
// parámetro deporte hay que pedírselo a Franco.

// Qué tan bien le va a cada deporte (0 a 1) y cuánto se cobra de seña
const ocupacionDePrueba: Record<Deporte, number> = {
  FUTBOL_5: 0.85,
  FUTBOL_7: 0.7,
  FUTBOL_11: 0.45,
  TENIS: 0.55,
  PADEL: 0.95,
  BASQUET: 0.4,
}
const senaDePrueba: Record<Deporte, number> = {
  FUTBOL_5: 4500,
  FUTBOL_7: 6000,
  FUTBOL_11: 9000,
  TENIS: 3000,
  PADEL: 3500,
  BASQUET: 4000,
}

// Cuánto se pide un horario (más de noche y el fin de semana; el tenis
// también a la mañana; martes a la mañana vacío)
function pesoDelHorario(deporte: Deporte, diaSemana: number, hora: number): number {
  if (diaSemana === 2 && hora < 12) return 0
  let peso = 1
  if (hora >= 18) peso += 3
  if (hora >= 20 && hora <= 22) peso += 2
  if (diaSemana === 5 || diaSemana === 6) peso += 2
  if (deporte === 'TENIS' && hora < 12) peso += 3
  return peso
}

// Métricas de un deporte de un complejo. indiceDelComplejo: cada complejo
// rinde un poco distinto. factor: el período anterior da otros números.
function metricasDePrueba(
  dias: number,
  factor: number,
  indiceDelComplejo: number,
  deporte: Deporte,
): MetricasDelPeriodo {
  const rindeElComplejo = Math.max(1 - indiceDelComplejo * 0.18, 0.4)
  const turnosOfrecidos = 15 * dias
  const turnosReservados = Math.round(
    turnosOfrecidos * ocupacionDePrueba[deporte] * rindeElComplejo * 0.8 * factor,
  )

  // Las reservas se reparten entre los horarios según cuánto se pide cada uno
  let pesoTotal = 0
  for (let diaSemana = 0; diaSemana < 7; diaSemana++) {
    for (let hora = 9; hora <= 23; hora++) {
      pesoTotal += pesoDelHorario(deporte, diaSemana, hora)
    }
  }
  const demanda: CeldaDeDemanda[] = []
  for (let diaSemana = 0; diaSemana < 7; diaSemana++) {
    for (let hora = 9; hora <= 23; hora++) {
      demanda.push({
        diaSemana,
        horaInicio: `${String(hora).padStart(2, '0')}:00`,
        reservas: Math.round(
          (turnosReservados * pesoDelHorario(deporte, diaSemana, hora)) / pesoTotal,
        ),
      })
    }
  }

  return {
    ocupacion: {
      turnosReservados,
      turnosOfrecidos,
      porcentaje: porcentaje(turnosReservados, turnosOfrecidos),
    },
    ingresos: turnosReservados * senaDePrueba[deporte],
    cancelaciones: Math.round(turnosReservados * 0.05),
    noShows: Math.round(turnosReservados * 0.02),
    demanda,
  }
}
// ---------- Fin de los datos de ejemplo ----------

type ComplejoConDeportes = { id: string; nombre: string; indice: number; deportes: Deporte[] }

// Suma las métricas de cada deporte de cada complejo (o solo las del deporte
// elegido). Así "todos" siempre es la suma exacta de sus partes.
function metricasDe(
  complejos: ComplejoConDeportes[],
  dias: number,
  factor: number,
  deporte: Deporte | undefined,
): MetricasDelPeriodo {
  const partes: MetricasDelPeriodo[] = []
  for (const complejo of complejos) {
    for (const unDeporte of complejo.deportes) {
      if (deporte !== undefined && unDeporte !== deporte) continue
      partes.push(metricasDePrueba(dias, factor, complejo.indice, unDeporte))
    }
  }
  return sumarMetricas(partes)
}

function urlDelDashboard(complejoId: string | undefined, dias: number, deporte?: Deporte) {
  const params = new URLSearchParams()
  if (complejoId !== undefined) params.set('complejoId', complejoId)
  params.set('dias', String(dias))
  if (deporte !== undefined) params.set('deporte', deporte)
  return `/dueno/dashboard?${params.toString()}`
}

export default async function DashboardDuenioPage({ searchParams }: PageProps<'/dueno/dashboard'>) {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.rol !== 'DUENIO') redirect('/jugador')

  const filtros = dashboardFiltersSchema.parse(await searchParams)

  // Solo los complejos del dueño logueado
  const complejos = await db.complejo.findMany({
    where: { duenioId: session.user.id, activo: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: 'asc' },
  })

  if (complejos.length === 0) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 pt-6 pb-12 md:pt-4">
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

  // Se arranca viendo todos los complejos. El elegido tiene que estar en la
  // lista del dueño: si en la URL viene uno ajeno, también se ven todos.
  let elegido: { id: string; nombre: string } | undefined = undefined
  for (const complejo of complejos) {
    if (complejo.id === filtros.complejoId) {
      elegido = complejo
    }
  }
  const sonTodos = elegido === undefined

  // Qué deportes tiene cada complejo (por sus canchas activas)
  const idsDelAlcance: string[] = []
  for (const complejo of complejos) {
    if (sonTodos || complejo.id === elegido?.id) idsDelAlcance.push(complejo.id)
  }
  const canchas = await db.cancha.findMany({
    where: { complejoId: { in: idsDelAlcance }, activo: true },
    distinct: ['complejoId', 'deporte'],
    select: { complejoId: true, deporte: true },
    orderBy: { deporte: 'asc' },
  })

  const complejosDelAlcance: ComplejoConDeportes[] = []
  for (let indice = 0; indice < complejos.length; indice++) {
    const complejo = complejos[indice]
    if (!idsDelAlcance.includes(complejo.id)) continue

    const deportesDelComplejo: Deporte[] = []
    for (const cancha of canchas) {
      if (cancha.complejoId === complejo.id) deportesDelComplejo.push(cancha.deporte)
    }
    complejosDelAlcance.push({ ...complejo, indice, deportes: deportesDelComplejo })
  }

  // Todos los deportes del alcance, sin repetir. Si en la URL viene uno que
  // no está, se muestran todos.
  const deportes: Deporte[] = []
  for (const cancha of canchas) {
    if (!deportes.includes(cancha.deporte)) deportes.push(cancha.deporte)
  }
  let deporte: Deporte | undefined = undefined
  if (filtros.deporte !== undefined && deportes.includes(filtros.deporte)) {
    deporte = filtros.deporte
  }

  const familias: FamiliaDeDeporte[] = []
  for (const unDeporte of deportes) {
    const familia = familiaDelDeporte(unDeporte)
    if (!familias.includes(familia)) familias.push(familia)
  }

  // El período termina hoy: "últimos 7 días" es hoy y los 6 anteriores. El
  // anterior es el mismo largo justo antes, para comparar.
  const hasta = diaDeHoy()
  const desde = sumarDias(hasta, -(filtros.dias - 1))
  const metricas = metricasDe(complejosDelAlcance, filtros.dias, 1, deporte)
  const anteriores = metricasDe(complejosDelAlcance, filtros.dias, 0.9, deporte)

  // Ranking por complejo: solo cuando se ven todos y hay más de uno
  const filasPorComplejo: FilaDeComplejo[] = []
  if (sonTodos) {
    for (const complejo of complejosDelAlcance) {
      if (deporte !== undefined && !complejo.deportes.includes(deporte)) continue
      const delComplejo = metricasDe([complejo], filtros.dias, 1, deporte)
      filasPorComplejo.push({
        id: complejo.id,
        nombre: complejo.nombre,
        deportes: complejo.deportes,
        porcentaje: delComplejo.ocupacion.porcentaje,
        turnosReservados: delComplejo.ocupacion.turnosReservados,
        ingresos: delComplejo.ingresos,
        href: urlDelDashboard(complejo.id, filtros.dias, deporte),
      })
    }
    filasPorComplejo.sort((a, b) => b.porcentaje - a.porcentaje)
  }

  // Por deporte: sin un deporte elegido y si hay más de uno
  const filasPorDeporte: FilaDeDeporte[] = []
  if (deporte === undefined && deportes.length > 1) {
    for (const unDeporte of deportes) {
      const delDeporte = metricasDe(complejosDelAlcance, filtros.dias, 1, unDeporte)
      filasPorDeporte.push({
        deporte: unDeporte,
        porcentaje: delDeporte.ocupacion.porcentaje,
        turnosReservados: delDeporte.ocupacion.turnosReservados,
        ingresos: delDeporte.ingresos,
        href: urlDelDashboard(elegido?.id, filtros.dias, unDeporte),
      })
    }
  }

  const { turnosReservados, turnosOfrecidos } = metricas.ocupacion
  const datosClave = {
    ingresos: metricas.ingresos,
    variacionIngresos: variacionPorcentual(metricas.ingresos, anteriores.ingresos),
    cancelaciones: metricas.cancelaciones,
    noShows: metricas.noShows,
    variacionPerdidos: variacionPorcentual(
      metricas.cancelaciones + metricas.noShows,
      anteriores.cancelaciones + anteriores.noShows,
    ),
    horarioPico: horarioMasPedido(metricas.demanda),
    horarioAImpulsar: horarioMenosPedido(metricas.demanda),
    hrefParaImpulsar: elegido ? `/dueno/complejos/${elegido.id}` : '/dueno/complejos',
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
        complejoId={elegido?.id}
        dias={filtros.dias}
        deporte={deporte}
      >
        <div className="space-y-6">
          <OccupancyHero
            alcance={elegido ? elegido.nombre : 'Todos los complejos'}
            porcentaje={metricas.ocupacion.porcentaje}
            turnosReservados={turnosReservados}
            turnosOfrecidos={turnosOfrecidos}
            variacionTurnos={variacionPorcentual(
              turnosReservados,
              anteriores.ocupacion.turnosReservados,
            )}
            deporte={deporte}
            familias={familias}
            resumen={<KpiTiles variante="bloque" {...datosClave} />}
          />

          {/* Con un deporte elegido, la cancha ocupa el lugar de los datos
              clave en el bloque principal: van acá abajo */}
          {deporte !== undefined && <KpiTiles variante="fila" {...datosClave} />}

          {filasPorComplejo.length > 1 && <ComplexBreakdown filas={filasPorComplejo} />}

          {filasPorDeporte.length > 0 && <SportBreakdown filas={filasPorDeporte} />}

          <DemandPanel demanda={metricas.demanda} demandaAnterior={anteriores.demanda} />
        </div>
      </DashboardFrame>
    </div>
  )
}
