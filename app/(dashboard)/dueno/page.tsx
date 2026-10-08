import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Building2, CalendarClock, LayoutGrid, Plus, User } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { pendientesVencidas } from '@/lib/bookings'
import { diaDeHoy, diaDeReserva } from '@/lib/time'
import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'
import { EtiquetaDeporte } from '@/components/etiqueta-deporte'
import { FechaDelTurno } from '@/components/fecha-del-turno'

export default async function DuenoHomePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const desdeHoy = new Date(diaDeHoy())
  const canchasDelDuenio = { complejo: { duenioId: session.user.id } }

  // Las cuatro consultas no dependen entre sí: se hacen a la vez (una sola
  // espera a la base en lugar de cuatro seguidas).
  const [totalComplejos, totalCanchas, totalProximasReservas, proximasReservas] = await Promise.all(
    [
      db.complejo.count({
        where: { duenioId: session.user.id, activo: true },
      }),
      db.cancha.count({
        where: { activo: true, complejo: { duenioId: session.user.id, activo: true } },
      }),
      db.reserva.count({
        where: {
          cancha: canchasDelDuenio,
          estado: { not: 'CANCELADA' },
          NOT: pendientesVencidas(),
          fecha: { gte: desdeHoy },
        },
      }),
      db.reserva.findMany({
        where: {
          cancha: canchasDelDuenio,
          estado: { not: 'CANCELADA' },
          NOT: pendientesVencidas(),
          fecha: { gte: desdeHoy },
        },
        include: { cancha: { include: { complejo: true } }, jugador: true },
        orderBy: [{ fecha: 'asc' }, { horaInicio: 'asc' }],
        take: 5,
      }),
    ],
  )

  return (
    <div className="max-w-5xl px-6 pt-6 pb-12 md:pt-4">
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

      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Próximos turnos en tus canchas</h2>
        <Link
          href="/dueno/complejos"
          className="text-muted-foreground hover:text-foreground inline-flex shrink-0 items-center gap-1.5 text-sm font-medium"
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
              className="border-border bg-card flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border p-5"
            >
              <FechaDelTurno
                dia={diaDeReserva(reserva.fecha)}
                horaInicio={reserva.horaInicio}
                horaFin={reserva.horaFin}
              />
              <div className="border-border hidden h-10 border-l sm:block" />
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold">{reserva.cancha.nombre}</span>
                  <EtiquetaDeporte deporte={reserva.cancha.deporte} />
                </div>
                <p className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-sm">
                  <User className="size-3.5 shrink-0" />
                  {reserva.cancha.complejo.nombre} · Reservó {reserva.jugador.nombre}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
