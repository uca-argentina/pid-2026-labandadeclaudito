import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
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
      <Link
        href={`/dueno/complejos/${id}/canchas`}
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-3.5" />
        Volver a canchas
      </Link>
      <p className="text-muted-foreground text-sm">{complejo.nombre}</p>
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
