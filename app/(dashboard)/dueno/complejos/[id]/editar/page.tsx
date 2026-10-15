import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { AyudaComplejo } from '@/components/ayuda-complejo'
import { ComplexEditForm } from '@/components/complex-edit-form'
import { ComplexPhotosEditor } from '@/components/complex-photos-editor'
import { DeleteComplexDialog } from '@/components/delete-complex-dialog'
import { getUpcomingBookingIds } from '@/lib/bookings'

export default async function EditarComplejoPage({
  params,
}: PageProps<'/dueno/complejos/[id]/editar'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const complejo = await db.complejo.findFirst({
    where: { id, duenioId: session.user.id, activo: true },
    include: {
      imagenes: { where: { activo: true }, orderBy: { orden: 'asc' } },
      canchas: { where: { activo: true } },
    },
  })
  if (!complejo) redirect('/dueno/complejos')

  // Para avisar en el diálogo de baja cuántas reservas se van a cancelar
  const idsDeCanchas: string[] = []
  for (const cancha of complejo.canchas) {
    idsDeCanchas.push(cancha.id)
  }
  const reservasFuturas = await getUpcomingBookingIds(idsDeCanchas)

  return (
    <main>
      <Link
        href={`/dueno/complejos/${id}`}
        className="text-muted-foreground hover:text-foreground mb-1 inline-flex h-11 items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Volver al complejo
      </Link>
      <h1 className="font-heading text-4xl font-bold tracking-tight">Editar {complejo.nombre}</h1>
      <div className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          {/* Solo los campos del form: el complejo trae canchas con precioBase (Decimal),
              que no se puede pasar a un Client Component */}
          <ComplexEditForm
            complejo={{
              id: complejo.id,
              nombre: complejo.nombre,
              direccion: complejo.direccion,
              zona: complejo.zona,
              contacto: complejo.contacto,
              porcentajeSenaDefault: complejo.porcentajeSenaDefault,
              minAdvanceMinutesDefault: complejo.minAdvanceMinutesDefault,
              cancellationHours: complejo.cancellationHours,
            }}
          />
          <ComplexPhotosEditor complejoId={id} imagenes={complejo.imagenes} />

          <div className="bg-destructive/8 flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
            <div>
              <p className="text-destructive font-semibold">Eliminar este complejo</p>
              <p className="text-foreground/80 mt-1 text-sm">
                Se despublica junto con sus canchas y fotos, y se cancelan sus reservas futuras.
              </p>
            </div>
            <DeleteComplexDialog
              complejoId={id}
              complejoNombre={complejo.nombre}
              reservasFuturas={reservasFuturas.length}
            />
          </div>
        </div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <AyudaComplejo />
        </aside>
      </div>
    </main>
  )
}
