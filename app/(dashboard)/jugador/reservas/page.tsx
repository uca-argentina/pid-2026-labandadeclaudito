import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarCheck } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { deporteLabels, estadoReservaLabels, formatPrecio } from '@/lib/labels'
import { diaDeReserva, formatearDia, turnoYaPaso } from '@/lib/time'
import { CancelBookingButton } from '@/components/cancel-booking-button'

export default async function MisReservasPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const reservas = await db.reserva.findMany({
    where: { jugadorId: session.user.id },
    include: { cancha: { include: { complejo: true } } },
    orderBy: [{ fecha: 'desc' }, { horaInicio: 'desc' }],
  })

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Mis reservas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Todos los turnos que reservaste, del más reciente al más viejo.
        </p>
      </div>

      {reservas.length === 0 ? (
        <div className="border-border bg-card rounded-2xl border p-8 text-center">
          <CalendarCheck className="text-muted-foreground mx-auto mb-3 size-8" />
          <p className="text-muted-foreground text-sm">Todavía no reservaste ninguna cancha.</p>
          <Link
            href="/jugador/canchas"
            className="text-primary mt-2 inline-block text-sm font-medium"
          >
            Buscar canchas
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva) => {
            const dia = diaDeReserva(reserva.fecha)
            const cancelada = reserva.estado === 'CANCELADA'
            const yaPaso = turnoYaPaso(dia, reserva.horaInicio)

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
                      {reserva.cancha.complejo.nombre} · {reserva.cancha.complejo.direccion}
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      {formatearDia(dia)} · {reserva.horaInicio} a {reserva.horaFin} hs
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-primary text-xl font-bold">
                      {formatPrecio(reserva.cancha.precioBase.toString())}
                    </div>
                    <div className="text-muted-foreground mb-2 text-xs">por turno</div>
                    {!cancelada && !yaPaso && <CancelBookingButton bookingId={reserva.id} />}
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
