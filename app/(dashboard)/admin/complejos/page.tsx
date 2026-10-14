import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { ImageIcon, MapPin, Phone, Shapes } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { complejoPorAprobar } from '@/lib/complejos'
import { haceCuanto } from '@/lib/fechas'
import { homePorRol } from '@/lib/home-por-rol'
import { iniciales } from '@/lib/iniciales'
import { deporteLabels } from '@/lib/labels'
import { diaDeHoy, momentoActual } from '@/lib/time'
import type { Deporte } from '@/lib/generated/prisma/client'
import { DecidirComplejo } from '@/components/decidir-complejo'
import { EstadoVacio } from '@/components/estado-vacio'

export const metadata: Metadata = {
  title: 'Complejos por aprobar | TocaYJuga',
}

// "Fútbol 5 · Pádel": los deportes distintos que tiene el complejo
function deportesDe(canchas: { deporte: Deporte }[]): string {
  const deportes: string[] = []
  for (const cancha of canchas) {
    const nombre = deporteLabels[cancha.deporte]
    if (!deportes.includes(nombre)) {
      deportes.push(nombre)
    }
  }
  return deportes.join(' · ')
}

export default async function ComplejosPorAprobarPage() {
  // El proxy ya filtra por rol, pero la página lo vuelve a chequear
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.rol !== 'ADMIN') redirect(homePorRol(session.user.rol))

  // Los que esperan hace más tiempo, primero
  const complejos = await db.complejo.findMany({
    where: complejoPorAprobar(),
    orderBy: { createdAt: 'asc' },
    include: {
      duenio: { select: { nombre: true, email: true } },
      imagenes: { where: { activo: true }, orderBy: { orden: 'asc' }, take: 1 },
      canchas: { where: { activo: true }, select: { deporte: true } },
    },
  })

  const hoy = diaDeHoy()

  return (
    <main>
      <h1 className="font-heading text-4xl font-bold tracking-tight">Complejos por aprobar</h1>
      <p className="text-muted-foreground mt-1.5">
        Revisá que los datos tengan sentido antes de que los vean los jugadores.
      </p>

      {complejos.length === 0 ? (
        <div className="mt-7">
          <EstadoVacio
            titulo="No hay complejos esperando revisión"
            texto="Cuando un dueño cargue un complejo nuevo, va a aparecer acá para que lo apruebes."
          />
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {complejos.map((complejo) => (
            <div
              key={complejo.id}
              className="bg-card shadow-card flex flex-col overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-16/10 shrink-0">
                {complejo.imagenes.length > 0 ? (
                  <Image
                    src={complejo.imagenes[0].url}
                    alt={`Foto de ${complejo.nombre}`}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-muted text-muted-foreground flex size-full flex-col items-center justify-center gap-1 text-sm">
                    <ImageIcon className="size-5" />
                    Sin fotos
                  </div>
                )}
                <span className="bg-card text-clay-foreground absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  Cargado {haceCuanto(momentoActual(complejo.createdAt).dia, hoy)}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5 pt-4">
                <p className="font-heading text-lg leading-snug font-bold">{complejo.nombre}</p>
                <div className="text-muted-foreground mt-1.5 space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4 shrink-0" /> {complejo.direccion} · {complejo.zona}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0" /> {complejo.contacto}
                  </p>
                  <p className="flex items-center gap-2">
                    <Shapes className="size-4 shrink-0" />
                    {complejo.canchas.length === 0
                      ? 'Todavía sin canchas'
                      : `${complejo.canchas.length} ${complejo.canchas.length === 1 ? 'cancha' : 'canchas'} · ${deportesDe(complejo.canchas)}`}
                  </p>
                </div>

                <div className="border-border mt-4 flex items-center gap-2.5 border-t pt-4">
                  <div className="bg-clay/15 text-clay-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    {iniciales(complejo.duenio.nombre)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{complejo.duenio.nombre}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {complejo.duenio.email}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  <DecidirComplejo complejoId={complejo.id} nombreComplejo={complejo.nombre} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
