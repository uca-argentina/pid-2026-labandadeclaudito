import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Building2, CalendarClock, LayoutGrid, Plus } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { deporteLabels } from '@/lib/labels'
import { diaDeHoy, diaDeReserva, formatearDia } from '@/lib/time'
import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'

export default async function DuenoHomePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const desdeHoy = new Date(diaDeHoy())
  const canchasDelDuenio = { complejo: { duenioId: session.user.id } }

  const totalComplejos = await db.complejo.count({ where: { duenioId: session.user.id } })
  const totalCanchas = await db.cancha.count({ where: canchasDelDuenio })

  const totalProximasReservas = await db.reserva.count({
    where: {
      cancha: canchasDelDuenio,
      estado: { not: 'CANCELADA' },
      fecha: { gte: desdeHoy },
    },
  })

  const proximasReservas = await db.reserva.findMany({
    where: {
      cancha: canchasDelDuenio,
      estado: { not: 'CANCELADA' },
      fecha: { gte: desdeHoy },
    },
    include: { cancha: { include: { complejo: true } }, jugador: true },
    orderBy: [{ fecha: 'asc' }, { horaInicio: 'asc' }],
    take: 5,
  })

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Hola, {session.user.name}</h1>
          <p className="text-muted-foreground mt-2">
            Administrá tus complejos, tus canchas y los turnos reservados.
          </p>
        </div>
        <Button render={<Link href="/dueno/complejos/nuevo" />}>
          <Plus className="size-4" />
          Nuevo complejo
        </Button>
      </div>

      <div className="mb-10 grid gap-5 sm:grid-cols-3">
        <StatCard
          icon={Building2}
          label="Complejos"
          value={totalComplejos}
          detalle="Cargados por vos"
        />
        <StatCard
          icon={LayoutGrid}
          label="Canchas"
          value={totalCanchas}
          detalle="En todos tus complejos"
        />
        <StatCard
          icon={CalendarClock}
          label="Turnos reservados"
          value={totalProximasReservas}
          detalle="De hoy en adelante"
        />
      </div>

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Próximos turnos en tus canchas</h2>
        <Link
          href="/dueno/complejos"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium"
        >
          Mis complejos
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {proximasReservas.length === 0 ? (
        <div className="border-border bg-card rounded-2xl border p-10 text-center">
          <CalendarClock className="text-muted-foreground mx-auto mb-4 size-8" />
          <p className="font-medium">Todavía no hay turnos reservados</p>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Cuando un jugador reserve una de tus canchas, va a aparecer acá.
          </p>
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
                  {reserva.cancha.complejo.nombre} · Reservó {reserva.jugador.nombre}
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
