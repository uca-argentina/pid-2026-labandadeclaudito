import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
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
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href={`/dueno/complejos/${id}`}
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-3.5" />
        Volver al complejo
      </Link>
      <h1 className="text-3xl font-semibold">Editar complejo: {complejo.nombre}</h1>
      <div className="mt-6 space-y-10">
        {/* Solo los campos del form: el complejo trae canchas con precioBase (Decimal),
            que no se puede pasar a un Client Component */}
        <ComplexEditForm
          complejo={{
            id: complejo.id,
            nombre: complejo.nombre,
            direccion: complejo.direccion,
            zona: complejo.zona,
            contacto: complejo.contacto,
          }}
        />
        <ComplexPhotosEditor complejoId={id} imagenes={complejo.imagenes} />

        <div className="border-destructive/40 flex items-center justify-between gap-4 rounded-2xl border border-dashed p-5">
          <div>
            <strong className="text-destructive text-sm">Eliminar este complejo</strong>
            <p className="text-muted-foreground mt-1 text-xs">
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
    </main>
  )
}
