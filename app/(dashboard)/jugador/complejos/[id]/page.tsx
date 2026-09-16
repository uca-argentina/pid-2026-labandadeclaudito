import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BadgeCheck } from 'lucide-react'
import { db } from '@/lib/db'
import { deporteLabels, formatPrecio, superficieLabels } from '@/lib/labels'
import { CourtSlotPicker } from '@/components/court-slot-picker'

export default async function ComplejoDetallePage({
  params,
}: PageProps<'/jugador/complejos/[id]'>) {
  const { id } = await params

  const complejo = await db.complejo.findUnique({
    where: { id },
    include: { canchas: { orderBy: { nombre: 'asc' } } },
  })
  if (!complejo) notFound()

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/jugador/canchas"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-3.5" />
        Volver a búsqueda de complejos
      </Link>

      <div className="mb-7">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold">{complejo.nombre}</h1>
          <span className="bg-primary/15 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
            <BadgeCheck className="size-3.5" />
            Verificado
          </span>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {complejo.direccion} · {complejo.zona} · Contacto: {complejo.contacto}
        </p>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Canchas disponibles en este complejo</h2>

      {complejo.canchas.length === 0 ? (
        <p className="text-muted-foreground mt-4 text-sm">
          Este complejo todavía no cargó canchas.
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          {complejo.canchas.map((cancha) => (
            <div key={cancha.id} className="border-border bg-card rounded-2xl border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{cancha.nombre}</span>
                    <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs">
                      {deporteLabels[cancha.deporte]}
                    </span>
                    <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs">
                      {superficieLabels[cancha.tipoSuperficie]}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    Horario regular: {cancha.horaApertura} a {cancha.horaCierre} hs
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-primary text-xl font-bold">
                    {formatPrecio(cancha.precioBase.toString())}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    por turno de {cancha.duracionTurnoMin} min
                  </div>
                </div>
              </div>

              <CourtSlotPicker
                courtId={cancha.id}
                courtName={cancha.nombre}
                courtSportLabel={deporteLabels[cancha.deporte]}
                duracionTurnoMin={cancha.duracionTurnoMin}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
