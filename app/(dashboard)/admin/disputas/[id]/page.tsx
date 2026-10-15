import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { homePorRol } from '@/lib/home-por-rol'
import { diaEnPalabras } from '@/lib/fechas'
import { estadoDeReserva } from '@/lib/estado-reserva'
import { ultimoDiaParaDisputar } from '@/lib/disputas'
import {
  decisionDisputaLabels,
  deporteLabels,
  estadoVisibleLabels,
  formatPrecio,
} from '@/lib/labels'
import { diaDeReserva, formatearDia, momentoActual } from '@/lib/time'
import { MiniCancha } from '@/components/mini-cancha'
import { ResolverDisputaForm } from '@/components/resolver-disputa-form'

// "12/10/2026 14:30": el día y la hora exacta en que pasó algo
function diaYHora(fecha: Date) {
  const momento = momentoActual(fecha)
  return `${formatearDia(momento.dia)} ${momento.hora}`
}

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{etiqueta}</p>
      <div className="font-medium">{children}</div>
    </div>
  )
}

export default async function DisputaDelAdminPage({ params }: PageProps<'/admin/disputas/[id]'>) {
  const session = await auth()
  if (!session) redirect('/login')
  // El proxy ya filtra por rol, pero la página lo vuelve a chequear (como el resto del admin)
  if (session.user.rol !== 'ADMIN') redirect(homePorRol(session.user.rol))

  const { id } = await params

  const disputa = await db.disputa.findUnique({
    where: { id },
    include: {
      reserva: {
        include: { cancha: { include: { complejo: true } }, jugador: true, pago: true },
      },
      evidencias: { orderBy: { orden: 'asc' } },
      admin: true,
    },
  })
  if (!disputa) notFound()

  const reserva = disputa.reserva
  const dia = diaDeReserva(reserva.fecha)
  const visible = estadoDeReserva(
    {
      estado: reserva.estado,
      asistio: reserva.asistio,
      dia,
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
    },
    momentoActual(),
  )

  return (
    <main>
      <Link
        href="/admin/disputas"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-3.5" />
        Disputas
      </Link>

      <h1 className="font-heading mt-2 text-4xl font-bold tracking-tight">
        {reserva.jugador.nombre} y {reserva.cancha.complejo.nombre}
      </h1>
      <p className="text-muted-foreground mt-1.5">
        Turno del {diaEnPalabras(dia)} de {reserva.horaInicio} a {reserva.horaFin} hs ·{' '}
        {reserva.cancha.nombre}
      </p>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
        <div className="space-y-6">
          <div className="bg-card shadow-card rounded-3xl p-6">
            <h2 className="font-heading text-xl font-bold">El turno</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Dato etiqueta="Complejo">{reserva.cancha.complejo.nombre}</Dato>
              <Dato etiqueta="Cancha">
                <span className="flex items-center gap-2">
                  <MiniCancha deporte={reserva.cancha.deporte} className="h-6 w-10 rounded-md" />
                  {reserva.cancha.nombre}
                  <span className="text-muted-foreground text-xs font-normal">
                    {deporteLabels[reserva.cancha.deporte]}
                  </span>
                </span>
              </Dato>
              <Dato etiqueta="Jugador">
                {reserva.jugador.nombre}
                <span className="text-muted-foreground block text-xs font-normal">
                  {reserva.jugador.email}
                </span>
              </Dato>
              <Dato etiqueta="Estado del turno">{estadoVisibleLabels[visible]}</Dato>
              <Dato etiqueta="Seña cobrada">
                {reserva.pago ? formatPrecio(reserva.pago.monto.toString()) : 'Sin seña'}
                <span className="text-muted-foreground block text-xs font-normal">
                  Precio del turno {formatPrecio(reserva.precioTurno.toString())}
                  {reserva.pago && ` · seña del ${reserva.pago.porcentaje}%`}
                </span>
              </Dato>
              {/* El plazo para disputar corre desde esta marca y no desde el
                  turno: es el dato que dice si el reclamo llegó a tiempo */}
              <Dato etiqueta="El complejo cargó la falta">
                {reserva.asistenciaMarcadaEn ? (
                  <>
                    {diaYHora(reserva.asistenciaMarcadaEn)}
                    <span className="text-muted-foreground block text-xs font-normal">
                      Último día para disputar:{' '}
                      {formatearDia(
                        ultimoDiaParaDisputar(momentoActual(reserva.asistenciaMarcadaEn).dia),
                      )}
                    </span>
                  </>
                ) : (
                  'Nunca la marcó'
                )}
              </Dato>
            </div>
          </div>

          <div className="bg-card shadow-card rounded-3xl p-6">
            <h2 className="font-heading text-xl font-bold">Lo que dice el jugador</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Reclamo abierto el {diaYHora(disputa.createdAt)}
            </p>
            <p className="mt-4 whitespace-pre-line">{disputa.descripcion}</p>
          </div>

          <div className="bg-card shadow-card rounded-3xl p-6">
            <h2 className="font-heading text-xl font-bold">Las pruebas</h2>
            {disputa.evidencias.length === 0 ? (
              <p className="text-muted-foreground mt-2 text-sm">El jugador no adjuntó imágenes.</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {disputa.evidencias.map((evidencia, indice) => (
                  <a
                    key={evidencia.id}
                    href={evidencia.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-muted relative aspect-square overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={evidencia.url}
                      alt={`Prueba ${indice + 1} de ${reserva.jugador.nombre}`}
                      fill
                      sizes="(min-width: 640px) 200px, 45vw"
                      className="object-cover"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {disputa.estado === 'ABIERTA' ? (
          <ResolverDisputaForm disputaId={disputa.id} />
        ) : (
          <div className="bg-card shadow-card rounded-3xl p-6">
            <h2 className="font-heading text-xl font-bold">Cómo se resolvió</h2>
            <p className="font-heading text-primary mt-3 text-2xl font-bold">
              {disputa.decision ? decisionDisputaLabels[disputa.decision] : 'Resuelta'}
            </p>
            <p className="mt-3 whitespace-pre-line">{disputa.comentarioAdmin}</p>
            <p className="text-muted-foreground mt-4 text-sm">
              {disputa.admin ? `Resuelta por ${disputa.admin.nombre}` : 'Resuelta'}
              {disputa.resueltaEn && ` el ${diaYHora(disputa.resueltaEn)}`}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
