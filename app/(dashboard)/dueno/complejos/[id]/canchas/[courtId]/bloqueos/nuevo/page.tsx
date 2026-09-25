import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { getComplexByOwner } from '@/lib/ownership'
import { BlockForm } from '@/components/block-form'

export default async function NuevoBloqueoPage({
  params,
}: PageProps<'/dueno/complejos/[id]/canchas/[courtId]/bloqueos/nuevo'>) {
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
      <h1 className="text-3xl font-semibold">Nuevo bloqueo</h1>
      <p className="text-muted-foreground mt-1 text-sm">{cancha.nombre}</p>
      <div className="mt-6">
        <BlockForm complejoId={id} courtId={courtId} />
      </div>
    </main>
  )
}
