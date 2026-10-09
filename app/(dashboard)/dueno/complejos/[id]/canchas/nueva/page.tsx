import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getComplexByOwner } from '@/lib/ownership'
import { CourtBatchForm } from '@/components/court-batch-form'

export default async function NuevaCanchaPage({
  params,
}: PageProps<'/dueno/complejos/[id]/canchas/nueva'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const complejo = await getComplexByOwner(id, session.user.id)
  if (!complejo) redirect('/dueno')

  return (
    <main>
      <p className="text-muted-foreground text-sm font-medium">{complejo.nombre}</p>
      <h1 className="font-heading mt-1 text-4xl font-bold tracking-tight">Nueva cancha</h1>
      <div className="mt-6">
        <CourtBatchForm complejoId={id} />
      </div>
    </main>
  )
}
