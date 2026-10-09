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
    <main>
      <Link
        href={`/dueno/complejos/${id}/canchas`}
        className="text-muted-foreground hover:text-foreground mb-1 inline-flex h-11 items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Volver a canchas
      </Link>
      <p className="text-muted-foreground text-sm font-medium">{complejo.nombre}</p>
      <h1 className="font-heading mt-1 text-4xl font-bold tracking-tight">
        Editar {cancha.nombre}
      </h1>
      <div className="mt-6">
        <CourtEditForm
          complejoId={id}
          cancha={{ ...cancha, precioBase: cancha.precioBase.toString() }}
        />
      </div>
    </main>
  )
}
