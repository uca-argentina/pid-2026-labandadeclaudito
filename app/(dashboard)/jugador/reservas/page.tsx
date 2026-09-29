import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarCheck } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { deporteLabels } from '@/lib/labels'
import { estadoVisible, montoDelHistorial } from '@/lib/historial'
import { diaDeReserva, formatearDia, turnoYaPaso } from '@/lib/time'
import { CancelBookingButton } from '@/components/cancel-booking-button'
import { PayDepositButton } from '@/components/pay-deposit-button'

async function getReservas(jugadorId: string) {
  return db.reserva.findMany({
    where: { jugadorId },
    include: { cancha: { include: { complejo: true } }, pago: true },
    orderBy: [{ fecha: 'desc' }, { horaInicio: 'desc' }],
  })
}

type Reserva = Awaited<ReturnType<typeof getReservas>>[number]

const tonos = {
  normal: 'text-primary',
  exito: 'text-green-600',
  peligro: 'text-destructive',
}

export default async function MisReservasPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const reservas = await getReservas(session.user.id)

  // Próximas: las que todavía se van a jugar, de la más cercana a la más lejana.
  // Historial: jugadas y canceladas, de la más reciente a la más vieja.
  const esProxima = (r: Reserva) =>
    r.estado !== 'CANCELADA' && !turnoYaPaso(diaDeReserva(r.fecha), r.horaInicio)
  const proximas = reservas.filter(esProxima).reverse()
  const historial = reservas.filter((r) => !esProxima(r))

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Mis reservas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Tus próximos turnos y todo lo que reservaste antes.
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
        <div className="space-y-8">
          {proximas.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-muted-foreground text-sm font-medium">Próximos</h2>
              {proximas.map((reserva) => (
                <TarjetaReserva key={reserva.id} reserva={reserva} />
              ))}
            </section>
          )}
          {historial.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-muted-foreground text-sm font-medium">Historial</h2>
              {historial.map((reserva) => (
                <TarjetaReserva key={reserva.id} reserva={reserva} />
              ))}
            </section>
          )}
        </div>
      )}
    </main>
  )
}

function TarjetaReserva({ reserva }: { reserva: Reserva }) {
  const dia = diaDeReserva(reserva.fecha)
  const cancelada = reserva.estado === 'CANCELADA'
  const yaPaso = turnoYaPaso(dia, reserva.horaInicio)
  const monto = montoDelHistorial(
    {
      estado: reserva.estado,
      precioTurno: reserva.precioTurno.toString(),
      pago: reserva.pago && { ...reserva.pago, monto: reserva.pago.monto.toString() },
    },
    yaPaso,
    'JUGADOR',
  )
  // Mismo cálculo que hace el endpoint de la seña: es solo para mostrar el
  // monto en el botón, el que se cobra lo calcula el server.
  const porcentajeSena =
    reserva.cancha.porcentajeSena ?? reserva.cancha.complejo.porcentajeSenaDefault
  const montoSena = ((Number(reserva.precioTurno) * porcentajeSena) / 100).toString()

  return (
    <div
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
              {estadoVisible(reserva.estado, yaPaso)}
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
          {monto && (
            <>
              <div className="text-muted-foreground text-xs">{monto.etiqueta}</div>
              <div className={`text-xl font-bold ${tonos[monto.tono]}`}>{monto.monto}</div>
              {monto.detalle && (
                <div className="text-muted-foreground text-xs">{monto.detalle}</div>
              )}
            </>
          )}
          {reserva.estado === 'PENDIENTE' && !yaPaso && (
            <div className="mt-2">
              <PayDepositButton bookingId={reserva.id} montoSena={montoSena} />
            </div>
          )}
          {!cancelada && !yaPaso && (
            <div className="mt-2">
              <CancelBookingButton bookingId={reserva.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
