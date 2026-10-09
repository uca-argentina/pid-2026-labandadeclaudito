import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, ImageIcon, ImagePlus, MapPin, Pencil, Phone, Plus, Shapes } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { dondeProximas } from '@/lib/bookings'
import { deporteLabels, formatPrecio, superficieLabels } from '@/lib/labels'
import { diaDeHoy, diaDeReserva, formatAdvanceTime } from '@/lib/time'
import { bloqueosDelDia, textoDelBloqueo } from '@/lib/blocks'
import { AvisoBloqueo } from '@/components/aviso-bloqueo'
import { Button } from '@/components/ui/button'
import { ComplexGallery } from '@/components/complex-gallery'
import { colorPorDeporte } from '@/components/etiqueta-deporte'
import { EstadoVacio } from '@/components/estado-vacio'
import { FilaDeTurno } from '@/components/fila-de-turno'
import { QuienReservo } from '@/components/quien-reservo'

export default async function DetalleComplejoDuenoPage({
  params,
}: PageProps<'/dueno/complejos/[id]'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params

  // Las dos consultas se hacen a la vez. Filtrar por duenioId hace de chequeo
  // de ownership: si el complejo es de otro dueño no aparece, y se corta con
  // notFound() antes de mostrar nada (incluidos sus turnos).
  const [complejo, proximosTurnos] = await Promise.all([
    db.complejo.findFirst({
      where: { id, duenioId: session.user.id, activo: true },
      include: {
        imagenes: { where: { activo: true }, orderBy: { orden: 'asc' } },
        canchas: { where: { activo: true }, orderBy: { nombre: 'asc' } },
      },
    }),
    db.reserva.findMany({
      where: {
        cancha: { complejoId: id },
        ...dondeProximas(),
      },
      include: { cancha: true, jugador: true },
      orderBy: [{ fecha: 'asc' }, { horaInicio: 'asc' }],
      take: 5,
    }),
  ])
  if (!complejo) notFound()

  // Bloqueos de hoy: la fila de una cancha bloqueada va en gris, con el motivo
  const idsDeCanchas: string[] = []
  for (const cancha of complejo.canchas) {
    idsDeCanchas.push(cancha.id)
  }
  const bloqueos = await bloqueosDelDia(idsDeCanchas, new Date(diaDeHoy()))

  const hoy = diaDeHoy()

  return (
    <main>
      <Link
        href="/dueno/complejos"
        className="text-muted-foreground hover:text-foreground mb-1 inline-flex h-11 items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Volver a mis complejos
      </Link>

      {/* Con fotos, el nombre va escrito sobre la portada; sin fotos, arriba */}
      {complejo.imagenes.length > 0 ? (
        <ComplexGallery imagenes={complejo.imagenes} nombreComplejo={complejo.nombre}>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {complejo.nombre}
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0" />
            {complejo.direccion} · {complejo.zona}
          </p>
        </ComplexGallery>
      ) : (
        <h1 className="font-heading mb-7 text-4xl font-bold tracking-tight">{complejo.nombre}</h1>
      )}

      {/* En celular la ficha con las acciones queda al final de la página:
          editar se repite acá arriba para tenerlo a mano */}
      <Button
        variant="outline"
        className="mb-6 lg:hidden"
        render={<Link href={`/dueno/complejos/${id}/editar`} />}
      >
        <Pencil className="size-4" />
        Editar complejo
      </Button>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* min-w-0: sin esto, en celular la columna se ensancha hasta el texto
            más largo de las filas y la página se desborda de costado */}
        <section className="min-w-0">
          {complejo.imagenes.length === 0 && (
            // Sin fotos: en lugar de la portada, una invitación a cargarlas
            <div className="bg-sand/60 mb-7 flex flex-col items-center gap-3 rounded-3xl px-6 py-9 text-center">
              <ImageIcon className="text-clay size-8" />
              <div>
                <p className="font-heading text-lg font-bold">Tu complejo todavía no tiene fotos</p>
                <p className="text-foreground/80 mt-1 text-sm">
                  Se muestran en la búsqueda y en la página del complejo que ven los jugadores.
                </p>
              </div>
              <Button size="sm" render={<Link href={`/dueno/complejos/${id}/editar#fotos`} />}>
                <ImagePlus className="size-4" />
                Cargar fotos
              </Button>
            </div>
          )}

          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3 px-1">
            <h2 className="font-heading text-xl font-bold">Canchas</h2>
            <Button render={<Link href={`/dueno/complejos/${id}/canchas`} />}>
              <Shapes className="size-4" />
              Gestionar canchas
            </Button>
          </div>

          {complejo.canchas.length === 0 ? (
            <div className="mb-9">
              <EstadoVacio
                titulo="Todavía no cargaste ninguna cancha"
                texto="Sin canchas, el complejo no aparece en la búsqueda de los jugadores."
              >
                <Button render={<Link href={`/dueno/complejos/${id}/canchas/nueva`} />}>
                  <Plus className="size-4" />
                  Cargar mi primera cancha
                </Button>
              </EstadoVacio>
            </div>
          ) : (
            <div className="bg-card shadow-card divide-border mb-9 divide-y rounded-3xl">
              {complejo.canchas.map((cancha) => {
                const bloqueosDeLaCancha = bloqueos.filter((b) => b.courtId === cancha.id)
                return (
                  <div
                    key={cancha.id}
                    className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-4 ${bloqueosDeLaCancha.length > 0 ? 'opacity-60 grayscale' : ''}`}
                  >
                    <div>
                      <p
                        className={`text-[11px] font-bold tracking-wider uppercase ${colorPorDeporte[cancha.deporte]}`}
                      >
                        {deporteLabels[cancha.deporte]} · {superficieLabels[cancha.tipoSuperficie]}
                      </p>
                      <p className="font-semibold">{cancha.nombre}</p>
                      <p className="text-muted-foreground text-sm">
                        {cancha.horaApertura} a {cancha.horaCierre} hs
                      </p>
                      {bloqueosDeLaCancha.length > 0 && (
                        <div className="mt-1">
                          <AvisoBloqueo texto={textoDelBloqueo(bloqueosDeLaCancha, true)} />
                        </div>
                      )}
                    </div>
                    <span className="font-heading text-primary text-xl font-bold">
                      {formatPrecio(cancha.precioBase.toString())}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          <h2 className="font-heading mb-3.5 px-1 text-xl font-bold">Próximos turnos</h2>

          {proximosTurnos.length === 0 ? (
            <EstadoVacio
              titulo="No hay turnos reservados en este complejo"
              texto="Cuando un jugador reserve una de estas canchas, va a aparecer acá."
            />
          ) : (
            <div className="space-y-3">
              {proximosTurnos.map((reserva) => (
                <FilaDeTurno
                  key={reserva.id}
                  href="/dueno/reservas"
                  dia={diaDeReserva(reserva.fecha)}
                  hoy={hoy}
                  horaInicio={reserva.horaInicio}
                  horaFin={reserva.horaFin}
                  deporte={reserva.cancha.deporte}
                  detalle={reserva.cancha.nombre}
                >
                  <QuienReservo nombre={reserva.jugador.nombre} />
                </FilaDeTurno>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="bg-card shadow-card rounded-3xl p-6">
            <div className="space-y-3.5">
              <p className="flex items-center gap-3">
                <span className="bg-muted flex size-9.5 shrink-0 items-center justify-center rounded-xl">
                  <MapPin className="size-4.5" />
                </span>
                {complejo.direccion} · {complejo.zona}
              </p>
              <p className="flex items-center gap-3">
                <span className="bg-muted flex size-9.5 shrink-0 items-center justify-center rounded-xl">
                  <Phone className="size-4.5" />
                </span>
                {complejo.contacto}
              </p>
            </div>
            <div className="border-border mt-5 space-y-3 border-t pt-4">
              <div>
                <p className="text-muted-foreground text-sm">Seña</p>
                <p className="font-semibold">{complejo.porcentajeSenaDefault}% del turno</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Cancelación con devolución</p>
                <p className="font-semibold">Hasta {complejo.cancellationHours} hs antes</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Anticipación mínima</p>
                <p className="font-semibold">
                  {formatAdvanceTime(complejo.minAdvanceMinutesDefault)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button variant="outline" render={<Link href={`/dueno/complejos/${id}/editar`} />}>
              <Pencil className="size-4" />
              Editar complejo
            </Button>
            <Button
              variant="outline"
              render={<Link href={`/dueno/complejos/${id}/canchas/nueva`} />}
            >
              <Plus className="size-4" />
              Nueva cancha
            </Button>
          </div>
        </aside>
      </div>
    </main>
  )
}
