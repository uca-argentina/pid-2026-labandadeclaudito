import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Building2 } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { diaDeHoy, sumarDias } from '@/lib/time'
import {
  horarioMasPedido,
  horarioMenosPedido,
  porcentaje,
  sumarMetricas,
  temaDelDeporte,
  urlDelDashboard,
  variacionPorcentual,
  type CeldaDeDemanda,
  type FiltrosDelDashboard,
  type MetricasDelPeriodo,
} from '@/lib/dashboard'
import {
  cantidadDeDias,
  diaSemanaDe,
  diasDeLaSemanaDe,
  periodoElegido,
  type Periodo,
  type VistaDelSelector,
} from '@/lib/periodos'
import { dashboardFiltersSchema } from '@/lib/validations/dashboard'
import type { Deporte } from '@/lib/generated/prisma/client'
import { ComplexBreakdown, type FilaDeComplejo } from '@/components/complex-breakdown'
import { DashboardFrame } from '@/components/dashboard-frame'
import { DemandPanel, type VistaDeDemanda } from '@/components/demand-panel'
import { KpiTiles } from '@/components/kpi-tiles'
import { OccupancyHero } from '@/components/occupancy-hero'
import { SportBreakdown, type FilaDeDeporte } from '@/components/sport-breakdown'
import { SportTabs, type PestanaDeDeporte } from '@/components/sport-tabs'
import { Button } from '@/components/ui/button'

// ---------- Datos de ejemplo (hasta que entre SCRUM-62) ----------
// Cuando entre lib/metricas-complejo.ts, metricasDePrueba se reemplaza por
// await metricasDelComplejo(complejo.id, periodo.desde, periodo.hasta, deporte).
// OJO: el parámetro deporte hay que pedírselo a Franco.

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

// Métricas de un deporte de un complejo en un período. Cada período rinde un
// poco distinto (según sus fechas), así al cambiar de período cambian los números.
function metricasDePrueba(
  periodo: Periodo,
  indiceDelComplejo: number,
  deporte: Deporte,
): MetricasDelPeriodo {
  const dias = cantidadDeDias(periodo)
  const rindeElComplejo = Math.max(1 - indiceDelComplejo * 0.18, 0.4)
  const rindeElPeriodo =
    0.8 +
    ((Number(periodo.desde.slice(8, 10)) * 7 + Number(periodo.desde.slice(5, 7)) * 3) % 10) * 0.03
  const turnosOfrecidos = 15 * dias
  const turnosReservados = Math.round(
    turnosOfrecidos * ocupacionDePrueba[deporte] * rindeElComplejo * rindeElPeriodo * 0.8,
  )

  // Cuánto pesa cada día de la semana × hora en el período (un día que se
  // repite, como los lunes de un mes, pesa más)
  const pesos: number[][] = []
  for (let diaSemana = 0; diaSemana < 7; diaSemana++) {
    pesos.push([])
    for (let hora = 9; hora <= 23; hora++) pesos[diaSemana].push(0)
  }
  let pesoTotal = 0
  for (let i = 0; i < dias; i++) {
    const diaSemana = diaSemanaDe(sumarDias(periodo.desde, i))
    for (let hora = 9; hora <= 23; hora++) {
      const peso = pesoDelHorario(deporte, diaSemana, hora)
      pesos[diaSemana][hora - 9] += peso
      pesoTotal += peso
    }
  }

  // Las reservas se reparten según esos pesos. Se redondea lo acumulado (no
  // cada celda) para que la suma dé exacto el total. Solo aparecen los días
  // de la semana que tiene el período.
  const demanda: CeldaDeDemanda[] = []
  let pesoAcumulado = 0
  for (let diaSemana = 0; diaSemana < 7; diaSemana++) {
    for (let hora = 9; hora <= 23; hora++) {
      const peso = pesos[diaSemana][hora - 9]
      if (peso === 0) continue
      const antes = Math.round((turnosReservados * pesoAcumulado) / pesoTotal)
      pesoAcumulado += peso
      const despues = Math.round((turnosReservados * pesoAcumulado) / pesoTotal)
      demanda.push({
        diaSemana,
        horaInicio: `${String(hora).padStart(2, '0')}:00`,
        reservas: despues - antes,
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
  periodo: Periodo,
  deporte: Deporte | undefined,
): MetricasDelPeriodo {
  const partes: MetricasDelPeriodo[] = []
  for (const complejo of complejos) {
    for (const unDeporte of complejo.deportes) {
      if (deporte !== undefined && unDeporte !== deporte) continue
      partes.push(metricasDePrueba(periodo, complejo.indice, unDeporte))
    }
  }
  return sumarMetricas(partes)
}

// Qué vistas de la demanda tienen sentido según el largo del período: con un
// día solo "por hora"; desde dos días, "por día"; desde 4 semanas, el mapa.
function vistasDeDemanda(dias: number): VistaDeDemanda[] {
  if (dias === 1) return ['hora']
  if (dias < 28) return ['hora', 'dia']
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
  const metricas = metricasDe(complejosDelAlcance, rangos.actual, deporte)
  const anteriores = metricasDe(complejosDelAlcance, rangos.anterior, deporte)

  // Ranking por complejo: solo cuando se ven todos y hay más de uno
  const filasPorComplejo: FilaDeComplejo[] = []
  if (sonTodos) {
    for (const complejo of complejosDelAlcance) {
      if (deporte !== undefined && !complejo.deportes.includes(deporte)) continue
      const delComplejo = metricasDe([complejo], rangos.actual, deporte)
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
      const delDeporte = metricasDe(complejosDelAlcance, rangos.actual, unDeporte)
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
    <div className={`${temaDelDeporte(deporte)} mx-auto w-full max-w-5xl px-6 pt-6 pb-12 md:pt-4`}>
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
            detalle (por complejo, por deporte) */}
        <div className="space-y-4 sm:space-y-5">
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

          {/* Con un deporte elegido, la cancha ocupa el lugar de los datos
              clave en el bloque principal: van acá abajo */}
          {deporte !== undefined && <KpiTiles variante="fila" {...datosClave} />}

          <DemandPanel
            demanda={metricas.demanda}
            demandaAnterior={anteriores.demanda}
            vistasDisponibles={vistasDeDemanda(cantidadDeDias(rangos.actual))}
            nombreDelAnterior={periodo.nombreDelAnterior}
          />

          {filasPorComplejo.length > 1 && <ComplexBreakdown filas={filasPorComplejo} />}

          {filasPorDeporte.length > 0 && <SportBreakdown filas={filasPorDeporte} />}
        </div>
      </DashboardFrame>
    </div>
  )
}
