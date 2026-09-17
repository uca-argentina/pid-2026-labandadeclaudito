import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Building2, CalendarCheck, CalendarClock, Search } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { deporteLabels } from '@/lib/labels'
import { diaDeHoy, diaDeReserva, formatearDia } from '@/lib/time'
import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'

export default async function JugadorHomePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const desdeHoy = new Date(diaDeHoy())

  const proximasReservas = await db.reserva.findMany({
    where: {
      jugadorId: session.user.id,
      estado: { not: 'CANCELADA' },
      fecha: { gte: desdeHoy },
    },
    include: { cancha: { include: { complejo: true } } },
    orderBy: [{ fecha: 'asc' }, { horaInicio: 'asc' }],
    take: 3,
  })

  const totalProximasReservas = await db.reserva.count({
    where: {
      jugadorId: session.user.id,
      estado: { not: 'CANCELADA' },
      fecha: { gte: desdeHoy },
    },
  })

  const totalReservas = await db.reserva.count({ where: { jugadorId: session.user.id } })

  const totalComplejos = await db.complejo.count({
    where: { activo: true, canchas: { some: { activo: true } } },
  })

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Hola, {session.user.name}</h1>
          <p className="text-muted-foreground mt-2">
            Buscá una cancha libre y reservá tu próximo partido.
          </p>
        </div>
        <Button render={<Link href="/jugador/canchas" />}>
          <Search className="size-4" />
          Buscar canchas
        </Button>
      </div>

      <div className="mb-10 grid gap-5 sm:grid-cols-3">
        <StatCard
          icon={CalendarClock}
          label="Próximos turnos"
          value={totalProximasReservas}
          detalle="Reservas de hoy en adelante"
        />
        <StatCard
          icon={CalendarCheck}
          label="Reservas totales"
          value={totalReservas}
          detalle="Desde que te registraste"
        />
        <StatCard
          icon={Building2}
          label="Complejos"
          value={totalComplejos}
          detalle="Disponibles para reservar"
        />
      </div>

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tus próximos turnos</h2>
        <Link
          href="/jugador/reservas"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium"
        >
          Ver todas
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {proximasReservas.length === 0 ? (
        <div className="border-border bg-card rounded-2xl border p-10 text-center">
          <CalendarClock className="text-muted-foreground mx-auto mb-4 size-8" />
          <p className="font-medium">No tenés turnos reservados</p>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Elegí un complejo y reservá el horario que te sirva.
          </p>
          <Button variant="outline" className="mt-5" render={<Link href="/jugador/canchas" />}>
            Buscar canchas
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {proximasReservas.map((reserva) => (
            <div
              key={reserva.id}
              className="border-border bg-card flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-6"
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold">{reserva.cancha.nombre}</span>
                  <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs">
                    {deporteLabels[reserva.cancha.deporte]}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1.5 text-sm">
                  {reserva.cancha.complejo.nombre} · {reserva.cancha.complejo.zona}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatearDia(diaDeReserva(reserva.fecha))}</p>
                <p className="text-muted-foreground text-sm">
                  {reserva.horaInicio} a {reserva.horaFin} hs
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
