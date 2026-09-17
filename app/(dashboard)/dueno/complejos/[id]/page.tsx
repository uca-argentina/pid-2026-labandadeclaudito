import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, CalendarClock, MapPin, Pencil, Phone, Plus, Shapes } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { deporteLabels, formatPrecio, superficieLabels } from '@/lib/labels'
import { diaDeHoy, diaDeReserva, formatearDia } from '@/lib/time'
import { Button, buttonVariants } from '@/components/ui/button'
import { ComplexGallery } from '@/components/complex-gallery'

export default async function DetalleComplejoDuenoPage({
  params,
}: PageProps<'/dueno/complejos/[id]'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params

  // Filtrar por duenioId hace de chequeo de ownership: si es de otro dueño, no aparece
  const complejo = await db.complejo.findFirst({
    where: { id, duenioId: session.user.id, activo: true },
    include: {
      imagenes: { where: { activo: true }, orderBy: { orden: 'asc' } },
      canchas: { where: { activo: true }, orderBy: { nombre: 'asc' } },
    },
  })
  if (!complejo) notFound()

  const proximosTurnos = await db.reserva.findMany({
    where: {
      cancha: { complejoId: id },
      estado: { not: 'CANCELADA' },
      fecha: { gte: new Date(diaDeHoy()) },
    },
    include: { cancha: true, jugador: true },
    orderBy: [{ fecha: 'asc' }, { horaInicio: 'asc' }],
    take: 5,
  })

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/dueno/complejos"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-3.5" />
        Volver a mis complejos
      </Link>

      <div className="mb-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold">{complejo.nombre}</h1>
          <Button variant="outline" render={<Link href={`/dueno/complejos/${id}/editar`} />}>
            <Pencil className="size-3.5" />
            Editar complejo
          </Button>
        </div>
        <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <p className="flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0" /> {complejo.direccion} · {complejo.zona}
          </p>
          <p className="flex items-center gap-1.5">
            <Phone className="size-4 shrink-0" /> {complejo.contacto}
          </p>
        </div>
      </div>

      <ComplexGallery imagenes={complejo.imagenes} nombreComplejo={complejo.nombre} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Canchas</h2>
        <Link href={`/dueno/complejos/${id}/canchas`} className={buttonVariants()}>
          <Shapes /> Gestionar canchas
        </Link>
      </div>

      {complejo.canchas.length === 0 ? (
        <div className="border-border mb-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-10 text-center">
          <p className="font-medium">Todavía no cargaste canchas</p>
          <p className="text-muted-foreground text-sm">
            Sin canchas, el complejo no aparece en la búsqueda de los jugadores.
          </p>
          <Link
            href={`/dueno/complejos/${id}/canchas/nueva`}
            className={buttonVariants({ variant: 'outline' })}
          >
            <Plus /> Cargar primera cancha
          </Link>
        </div>
      ) : (
        <div className="border-border bg-card mb-10 divide-y rounded-2xl border">
          {complejo.canchas.map((cancha) => (
            <div
              key={cancha.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div>
                <span className="font-semibold">{cancha.nombre}</span>
                <p className="text-muted-foreground text-sm">
                  {deporteLabels[cancha.deporte]} · {superficieLabels[cancha.tipoSuperficie]} ·{' '}
                  {cancha.horaApertura} a {cancha.horaCierre} hs
                </p>
              </div>
              <span className="text-primary font-bold">
                {formatPrecio(cancha.precioBase.toString())}
              </span>
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-4 text-xl font-semibold">Próximos turnos</h2>

      {proximosTurnos.length === 0 ? (
        <div className="border-border bg-card rounded-2xl border p-10 text-center">
          <CalendarClock className="text-muted-foreground mx-auto mb-4 size-8" />
          <p className="font-medium">No hay turnos reservados en este complejo</p>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Cuando un jugador reserve una de estas canchas, va a aparecer acá.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {proximosTurnos.map((reserva) => (
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
                  Reservó {reserva.jugador.nombre}
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
    </main>
  )
}
