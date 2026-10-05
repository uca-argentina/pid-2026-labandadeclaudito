import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Ban, Building2, Percent, UserX, Wallet } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { formatPrecio } from '@/lib/labels'
import { diaDeHoy, formatearDia, sumarDias } from '@/lib/time'
import { dashboardFiltersSchema } from '@/lib/validations/dashboard'
import { StatCard } from '@/components/stat-card'
import { DashboardFilters } from '@/components/dashboard-filters'
import { DemandHeatmap } from '@/components/demand-heatmap'
import { Button } from '@/components/ui/button'

// Forma acordada con SCRUM-62. Cuando entre lib/metricas-complejo.ts, este
// tipo y metricasDePrueba se borran y se usa metricasDelComplejo().
type MetricasComplejo = {
  ocupacion: { turnosReservados: number; turnosOfrecidos: number; porcentaje: number }
  ingresos: number
  cancelaciones: number
  noShows: number
  demanda: { diaSemana: number; horaInicio: string; reservas: number }[]
}

function metricasDePrueba(dias: number): MetricasComplejo {
  const demanda: { diaSemana: number; horaInicio: string; reservas: number }[] = []
  for (let diaSemana = 0; diaSemana < 7; diaSemana++) {
    for (let hora = 9; hora <= 23; hora++) {
      let reservas = 1
      if (hora >= 18) reservas += 3
      if (hora >= 20 && hora <= 22) reservas += 2
      if (diaSemana === 5 || diaSemana === 6) reservas += 2
      demanda.push({
        diaSemana,
        horaInicio: `${String(hora).padStart(2, '0')}:00`,
        reservas: Math.round((reservas * dias) / 7),
      })
    }
  }

  return {
    ocupacion: { turnosReservados: 9 * dias, turnosOfrecidos: 15 * dias, porcentaje: 60 },
    ingresos: 4500 * dias,
    cancelaciones: Math.round(dias / 3),
    noShows: Math.round(dias / 7),
    demanda,
  }
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

  // El período termina hoy: "últimos 7 días" es hoy y los 6 anteriores
  const hasta = diaDeHoy()
  const desde = sumarDias(hasta, -(filtros.dias - 1))
  const metricas = metricasDePrueba(filtros.dias)

  return (
    <div className="mx-auto max-w-5xl px-6 pt-6 pb-12 md:pt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Estadísticas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {complejoElegido.nombre} · del {formatearDia(desde)} al {formatearDia(hasta)}
        </p>
      </div>

      <div className="mb-8">
        <DashboardFilters
          complejos={complejos}
          complejoId={complejoElegido.id}
          dias={filtros.dias}
        />
      </div>

      <p className="border-border text-muted-foreground mb-6 rounded-lg border border-dashed px-4 py-2 text-sm">
        Datos de ejemplo: todavía no están conectados los cálculos reales.
      </p>

      <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Percent}
          label="Ocupación"
          value={`${metricas.ocupacion.porcentaje}%`}
          detalle={`${metricas.ocupacion.turnosReservados} de ${metricas.ocupacion.turnosOfrecidos} turnos`}
        />
        <StatCard
          icon={Wallet}
          label="Ingresos"
          value={formatPrecio(metricas.ingresos)}
          detalle="Señas cobradas (simulado)"
        />
        <StatCard
          icon={Ban}
          label="Cancelaciones"
          value={metricas.cancelaciones}
          detalle="Reservas canceladas"
        />
        <StatCard
          icon={UserX}
          label="No-shows"
          value={metricas.noShows}
          detalle="Jugadores que no se presentaron"
        />
      </div>

      <section className="border-border bg-card rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">Horarios de mayor demanda</h2>
        <p className="text-muted-foreground mt-1 mb-5 text-sm">
          Cantidad de reservas por día de la semana y hora de inicio.
        </p>
        <DemandHeatmap demanda={metricas.demanda} />
      </section>
    </div>
  )
}
