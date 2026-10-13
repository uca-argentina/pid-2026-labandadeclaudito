import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ImageIcon, MapPin, Phone, Plus, Shapes } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { clasesGrillaAdaptable } from '@/lib/grid-columns'
import { bloqueosDelDia, resumenBloqueosDelComplejo } from '@/lib/blocks'
import { diaDeHoy } from '@/lib/time'
import { AvisoBloqueo } from '@/components/aviso-bloqueo'
import { Button } from '@/components/ui/button'
import { EstadoVacio } from '@/components/estado-vacio'

export const metadata: Metadata = {
  title: 'Mis complejos | TocaYJuga',
}

export default async function MisComplejosPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.rol !== 'DUENIO') redirect('/jugador')

  const complejosDelDuenio = await db.complejo.findMany({
    where: { duenioId: session.user.id, activo: true },
    orderBy: { createdAt: 'desc' },
    include: {
      imagenes: { where: { activo: true }, orderBy: { orden: 'asc' }, take: 1 },
      canchas: { where: { activo: true }, select: { id: true } },
    },
  })

  // Bloqueos de hoy: un complejo con todas sus canchas bloqueadas va en gris
  const idsDeCanchas: string[] = []
  for (const complejo of complejosDelDuenio) {
    for (const cancha of complejo.canchas) {
      idsDeCanchas.push(cancha.id)
    }
  }
  const bloqueos = await bloqueosDelDia(idsDeCanchas, new Date(diaDeHoy()))

  function bloqueadasDe(canchas: { id: string }[]) {
    let bloqueadas = 0
    for (const cancha of canchas) {
      if (bloqueos.some((b) => b.courtId === cancha.id)) {
        bloqueadas++
      }
    }
    return bloqueadas
  }

  return (
    <main>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight">Mis complejos</h1>
          <p className="text-muted-foreground mt-1.5">
            Entrá a un complejo para ver sus turnos o gestionar sus canchas.
          </p>
        </div>
        <Button render={<Link href="/dueno/complejos/nuevo" />}>
          <Plus className="size-4" />
          Crear complejo
        </Button>
      </div>

      {complejosDelDuenio.length === 0 && (
        <EstadoVacio
          titulo="Todavía no cargaste ningún complejo"
          texto="Cargá tu complejo y sus canchas para que los jugadores puedan reservar."
        >
          <Button render={<Link href="/dueno/complejos/nuevo" />}>
            <Plus className="size-4" />
            Cargar mi primer complejo
          </Button>
        </EstadoVacio>
      )}

      {complejosDelDuenio.length > 0 && (
        <div className="@container">
          <div className={`grid gap-5 ${clasesGrillaAdaptable(complejosDelDuenio.length)}`}>
            {complejosDelDuenio.map((complejo) => {
              const bloqueadas = bloqueadasDe(complejo.canchas)
              const resumenBloqueos = resumenBloqueosDelComplejo(
                bloqueadas,
                complejo.canchas.length,
              )
              const todasBloqueadas =
                complejo.canchas.length > 0 && bloqueadas === complejo.canchas.length
              return (
                <div
                  key={complejo.id}
                  // has-[>a:hover]: al pasar el mouse por la foto o los datos se pinta
                  // la tarjeta entera. Si el fondo fuera del Link, se cortaría
                  // justo arriba de "Ver canchas".
                  className={`bg-card shadow-card has-[>a:hover]:bg-accent flex h-full flex-col overflow-hidden rounded-2xl transition-colors ${todasBloqueadas ? 'opacity-60 grayscale' : ''}`}
                >
                  {/* Foto y datos abren el detalle; "Ver canchas" queda afuera para no anidar
                  links. flex-1 en el Link: así "Ver canchas" queda a la misma altura en
                  toda la fila, aunque el nombre ocupe distinta cantidad de líneas. */}
                  <Link href={`/dueno/complejos/${complejo.id}`} className="flex flex-1 flex-col">
                    <div className="relative aspect-16/10 shrink-0">
                      {complejo.imagenes.length > 0 ? (
                        <Image
                          src={complejo.imagenes[0].url}
                          alt={`Foto de ${complejo.nombre}`}
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-muted text-muted-foreground flex size-full flex-col items-center justify-center gap-1 text-sm">
                          <ImageIcon className="size-5" />
                          Sin fotos
                        </div>
                      )}
                      <span className="bg-card absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        {complejo.canchas.length === 1
                          ? '1 cancha'
                          : `${complejo.canchas.length} canchas`}
                      </span>
                    </div>

                    <div className="p-5 pt-4">
                      <span className="font-heading block text-lg leading-snug font-bold">
                        {complejo.nombre}
                      </span>
                      <div className="text-muted-foreground mt-1.5 space-y-1 text-sm">
                        <p className="flex items-center gap-2">
                          <MapPin className="size-4 shrink-0" /> {complejo.direccion} ·{' '}
                          {complejo.zona}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="size-4 shrink-0" /> {complejo.contacto}
                        </p>
                        {resumenBloqueos && <AvisoBloqueo texto={`${resumenBloqueos} hoy`} />}
                      </div>
                    </div>
                  </Link>
                  <div className="px-5 pb-5">
                    <Button
                      variant="outline"
                      className="w-full"
                      render={<Link href={`/dueno/complejos/${complejo.id}/canchas`} />}
                    >
                      <Shapes className="size-4" />
                      Ver canchas
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}
