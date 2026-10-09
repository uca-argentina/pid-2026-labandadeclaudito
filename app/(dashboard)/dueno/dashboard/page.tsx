import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Building2 } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { diaDeHoy } from '@/lib/time'
import { metricasDelComplejo } from '@/lib/metricas-complejo'
import {
  horarioMasPedido,
  horarioMenosPedido,
  sumarMetricas,
  temaDelDeporte,
  urlDelDashboard,
  variacionPorcentual,
  type FiltrosDelDashboard,
  type MetricasDelPeriodo,
} from '@/lib/dashboard'
import {
  cantidadDeDias,
  diasDeLaSemanaDe,
  periodoElegido,
  type VistaDelSelector,
} from '@/lib/periodos'
import { dashboardFiltersSchema } from '@/lib/validations/dashboard'
import type { Deporte } from '@/lib/generated/prisma/client'
import { ComplexBreakdown, type FilaDeComplejo } from '@/components/complex-breakdown'
import { DashboardFrame } from '@/components/dashboard-frame'
import { DemandPanel, type VistaDeDemanda } from '@/components/demand-panel'
import { FadeIn } from '@/components/fade-in'
import { KpiTiles } from '@/components/kpi-tiles'
import { OccupancyHero } from '@/components/occupancy-hero'
import { SportBreakdown, type FilaDeDeporte } from '@/components/sport-breakdown'
import { SportTabs, type PestanaDeDeporte } from '@/components/sport-tabs'
import { Button } from '@/components/ui/button'

// Métricas de un deporte de un complejo en el período actual y en el anterior
// (para comparar)
type MetricasDeUnDeporte = {
  complejoId: string
  deporte: Deporte
  actual: MetricasDelPeriodo
  anterior: MetricasDelPeriodo
}

// Suma las métricas que entran en el filtro (un complejo, un deporte, o todas
// si no viene ninguno). Así "todos" siempre es la suma exacta de sus partes.
function metricasDe(
  lista: MetricasDeUnDeporte[],
  periodo: 'actual' | 'anterior',
  filtro: { complejoId?: string; deporte?: Deporte },
): MetricasDelPeriodo {
  const partes: MetricasDelPeriodo[] = []
  for (const metricas of lista) {
    if (filtro.complejoId !== undefined && metricas.complejoId !== filtro.complejoId) continue
    if (filtro.deporte !== undefined && metricas.deporte !== filtro.deporte) continue
    partes.push(metricas[periodo])
  }
  return sumarMetricas(partes)
}

// Qué vistas de la demanda tienen sentido según el largo del período: con un
// día solo "por hora"; desde dos días, también por día y el mapa.
function vistasDeDemanda(dias: number): VistaDeDemanda[] {
  if (dias === 1) return ['hora']
  return ['hora', 'dia', 'semana']
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

  // ---- Período ----
  // Qué se mide, contra qué se compara y a dónde lleva cada botón del selector
  const vista = filtros.vista
  const hoy = diaDeHoy()
  const periodo = periodoElegido(vista, filtros, hoy)
  const rangos = { actual: periodo.actual, anterior: periodo.anterior }

  // ---- Complejos y deportes ----
  // Se arranca viendo todos los complejos. El elegido tiene que estar en la
  // lista del dueño: si en la URL viene uno ajeno, también se ven todos.
  let elegido: { id: string; nombre: string } | undefined = undefined
  for (const complejo of complejos) {
    if (complejo.id === filtros.complejoId) {
      elegido = complejo
    }
  }
  const sonTodos = elegido === undefined

  const idsDelAlcance: string[] = []
  for (const complejo of complejos) {
    if (sonTodos || complejo.id === elegido?.id) idsDelAlcance.push(complejo.id)
  }
  // Qué deportes tiene cada complejo (por sus canchas activas)
  const canchas = await db.cancha.findMany({
    where: { complejoId: { in: idsDelAlcance }, activo: true },
    distinct: ['complejoId', 'deporte'],
    select: { complejoId: true, deporte: true },
    orderBy: { deporte: 'asc' },
  })

  const complejosDelAlcance: { id: string; nombre: string; deportes: Deporte[] }[] = []
  for (const complejo of complejos) {
    if (!idsDelAlcance.includes(complejo.id)) continue

    const deportesDelComplejo: Deporte[] = []
    for (const cancha of canchas) {
      if (cancha.complejoId === complejo.id) deportesDelComplejo.push(cancha.deporte)
    }
    complejosDelAlcance.push({ ...complejo, deportes: deportesDelComplejo })
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

  // Los filtros ya validados, y los de cada botón del selector de tiempo
  const alcance = { complejoId: elegido?.id, deporte }
  const filtrosValidos: FiltrosDelDashboard = { ...alcance, vista, ...periodo.fechasActuales }
  const filtrosPorVista: Record<VistaDelSelector, FiltrosDelDashboard> = {
    dia: { ...alcance, vista: 'dia', ...periodo.fechasPorVista.dia },
    semana: { ...alcance, vista: 'semana', ...periodo.fechasPorVista.semana },
    mes: { ...alcance, vista: 'mes', ...periodo.fechasPorVista.mes },
    rango: { ...alcance, vista: 'rango', ...periodo.fechasPorVista.rango },
  }

  // Pestañas de deporte del bloque principal (con un solo deporte no hay nada
  // que elegir)
  const pestanas: PestanaDeDeporte[] = []
  if (deportes.length > 1) {
    pestanas.push({
      deporte: undefined,
      href: urlDelDashboard({ ...filtrosValidos, deporte: undefined }),
      activa: deporte === undefined,
    })
    for (const unDeporte of deportes) {
      pestanas.push({
        deporte: unDeporte,
        href: urlDelDashboard({ ...filtrosValidos, deporte: unDeporte }),
        activa: deporte === unDeporte,
      })
    }
  }

  // ---- Métricas ----
  // Una consulta por cada deporte de cada complejo, y después se suman como
  // haga falta. Entran también los deportes de canchas dadas de baja: sus
  // reservas pasadas siguen contando en ingresos y cancelaciones (la ocupación
  // ya las deja afuera).
  const deportesConReservas = await db.cancha.findMany({
    where: { complejoId: { in: idsDelAlcance } },
    distinct: ['complejoId', 'deporte'],
    select: { complejoId: true, deporte: true },
  })
  const metricasPorDeporte: MetricasDeUnDeporte[] = await Promise.all(
    deportesConReservas.map(async (parte) => {
      const filtro = { deporte: parte.deporte }
      const actual = await metricasDelComplejo(
        parte.complejoId,
        rangos.actual.desde,
        rangos.actual.hasta,
        filtro,
      )
      const anterior = await metricasDelComplejo(
        parte.complejoId,
        rangos.anterior.desde,
        rangos.anterior.hasta,
        filtro,
      )
      return { complejoId: parte.complejoId, deporte: parte.deporte, actual, anterior }
    }),
  )

  const metricas = metricasDe(metricasPorDeporte, 'actual', { deporte })
  const anteriores = metricasDe(metricasPorDeporte, 'anterior', { deporte })

  // Ranking por complejo: solo cuando se ven todos y hay más de uno
  const filasPorComplejo: FilaDeComplejo[] = []
  if (sonTodos) {
    for (const complejo of complejosDelAlcance) {
      if (deporte !== undefined && !complejo.deportes.includes(deporte)) continue
      const delComplejo = metricasDe(metricasPorDeporte, 'actual', {
        complejoId: complejo.id,
        deporte,
      })
      filasPorComplejo.push({
        id: complejo.id,
        nombre: complejo.nombre,
        deportes: complejo.deportes,
        porcentaje: delComplejo.ocupacion.porcentaje,
        turnosReservados: delComplejo.ocupacion.turnosReservados,
        ingresos: delComplejo.ingresos,
        href: urlDelDashboard({ ...filtrosValidos, complejoId: complejo.id }),
      })
    }
    filasPorComplejo.sort((a, b) => b.porcentaje - a.porcentaje)
  }

  // Por deporte: sin un deporte elegido y si hay más de uno
  const filasPorDeporte: FilaDeDeporte[] = []
  if (deporte === undefined && deportes.length > 1) {
    for (const unDeporte of deportes) {
      const delDeporte = metricasDe(metricasPorDeporte, 'actual', { deporte: unDeporte })
      filasPorDeporte.push({
        deporte: unDeporte,
        porcentaje: delDeporte.ocupacion.porcentaje,
        turnosReservados: delDeporte.ocupacion.turnosReservados,
        ingresos: delDeporte.ingresos,
        href: urlDelDashboard({ ...filtrosValidos, deporte: unDeporte }),
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
    horarioAImpulsar: horarioMenosPedido(metricas.demanda, diasDeLaSemanaDe(rangos.actual)),
    hrefParaImpulsar: elegido ? `/dueno/complejos/${elegido.id}` : '/dueno/complejos',
  }

  return (
    // El tema pinta todo lo de adentro con los colores del deporte elegido
    <div className={`${temaDelDeporte(deporte)} mx-auto w-full max-w-5xl px-6 pt-6 pb-6 md:pt-4`}>
      <DashboardFrame
        complejos={complejos}
        filtros={filtrosValidos}
        periodo={{
          titulo: periodo.titulo,
          subtitulo: periodo.subtitulo,
          esElActual: periodo.esElActual,
          rango: vista === 'rango' ? { ...periodo.actual, hoy } : null,
          anterior: { ...alcance, vista, ...periodo.fechasAnterior },
          siguiente: { ...alcance, vista, ...periodo.fechasSiguiente },
          hoy: { ...alcance, vista, ...periodo.fechasDeHoy },
          porVista: filtrosPorVista,
        }}
      >
        {/* El orden de un buen tablero: primero el panorama (ocupación y
            datos clave), después cuándo se juega (demanda) y al final el
            detalle (por complejo, por deporte). Al cargar entran de a una. */}
        <div className="space-y-4 sm:space-y-5">
          <FadeIn orden={0}>
            <OccupancyHero
              pestanas={pestanas.length > 0 ? <SportTabs pestanas={pestanas} /> : null}
              comparacion={periodo.comparacion}
              porcentaje={metricas.ocupacion.porcentaje}
              turnosReservados={turnosReservados}
              turnosOfrecidos={turnosOfrecidos}
              variacionTurnos={variacionPorcentual(
                turnosReservados,
                anteriores.ocupacion.turnosReservados,
              )}
              deporte={deporte}
              resumen={<KpiTiles variante="bloque" {...datosClave} />}
            />
          </FadeIn>

          {/* Con un deporte elegido, la cancha ocupa el lugar de los datos
              clave en el bloque principal: van acá abajo */}
          {deporte !== undefined && (
            <FadeIn orden={1}>
              <KpiTiles variante="fila" {...datosClave} />
            </FadeIn>
          )}

          <FadeIn orden={2}>
            <DemandPanel
              demanda={metricas.demanda}
              demandaAnterior={anteriores.demanda}
              vistasDisponibles={vistasDeDemanda(cantidadDeDias(rangos.actual))}
              nombreDelAnterior={periodo.nombreDelAnterior}
              diasDelPeriodo={diasDeLaSemanaDe(rangos.actual)}
            />
          </FadeIn>

          {filasPorComplejo.length > 1 && (
            <FadeIn orden={3}>
              <ComplexBreakdown filas={filasPorComplejo} />
            </FadeIn>
          )}

          {filasPorDeporte.length > 0 && (
            <FadeIn orden={4}>
              <SportBreakdown filas={filasPorDeporte} />
            </FadeIn>
          )}
        </div>
      </DashboardFrame>
    </div>
  )
}
