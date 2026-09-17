import { redirect } from 'next/navigation'
import { CalendarClock } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { deporteLabels, estadoReservaLabels, formatPrecio } from '@/lib/labels'
import { diaDeReserva, formatearDia } from '@/lib/time'

export default async function ReservasDelDuenioPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const reservas = await db.reserva.findMany({
    where: { cancha: { complejo: { duenioId: session.user.id } } },
    include: { cancha: { include: { complejo: true } }, jugador: true },
    orderBy: [{ fecha: 'desc' }, { horaInicio: 'desc' }],
  })

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Reservas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Todos los turnos reservados en tus canchas, del más reciente al más viejo.
        </p>
      </div>

      {reservas.length === 0 ? (
        <div className="border-border bg-card rounded-2xl border p-8 text-center">
          <CalendarClock className="text-muted-foreground mx-auto mb-3 size-8" />
          <p className="font-medium">Todavía no hay turnos reservados</p>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Cuando un jugador reserve una de tus canchas, va a aparecer acá.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva) => {
            const cancelada = reserva.estado === 'CANCELADA'

            return (
              <div
                key={reserva.id}
                className={
                  cancelada
                    ? 'border-border bg-card rounded-2xl border p-5 opacity-60'
                    : 'border-border bg-card rounded-2xl border p-5'
                }
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{reserva.cancha.nombre}</span>
                      <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs">
                        {deporteLabels[reserva.cancha.deporte]}
                      </span>
                      <span
                        className={
                          cancelada
                            ? 'bg-destructive/15 text-destructive rounded-full px-2.5 py-1 text-xs font-medium'
                            : 'bg-primary/15 text-primary rounded-full px-2.5 py-1 text-xs font-medium'
                        }
                      >
                        {estadoReservaLabels[reserva.estado]}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {reserva.cancha.complejo.nombre}
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      {formatearDia(diaDeReserva(reserva.fecha))} · {reserva.horaInicio} a{' '}
                      {reserva.horaFin} hs
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Reservó {reserva.jugador.nombre} · {reserva.jugador.email}
                      {reserva.jugador.telefono ? ` · ${reserva.jugador.telefono}` : ''}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-primary text-xl font-bold">
                      {formatPrecio(reserva.cancha.precioBase.toString())}
                    </div>
                    <div className="text-muted-foreground text-xs">por turno</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
