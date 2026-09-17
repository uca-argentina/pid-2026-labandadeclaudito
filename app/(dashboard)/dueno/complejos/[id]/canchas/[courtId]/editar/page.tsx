import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getComplexByOwner } from '@/lib/ownership'
import { db } from '@/lib/db'
import { CourtEditForm } from '@/components/court-edit-form'

export default async function EditarCanchaPage({
  params,
}: PageProps<'/dueno/complejos/[id]/canchas/[courtId]/editar'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id, courtId } = await params
  const complejo = await getComplexByOwner(id, session.user.id)
  if (!complejo) redirect('/dueno')

  const cancha = await db.cancha.findFirst({
    where: { id: courtId, complejoId: id, activo: true },
  })
  if (!cancha) redirect(`/dueno/complejos/${id}/canchas`)

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Editar cancha: {cancha.nombre}</h1>
      <div className="mt-6">
        <CourtEditForm
          complejoId={id}
          cancha={{ ...cancha, precioBase: cancha.precioBase.toString() }}
        />
      </div>
    </main>
  )
}
