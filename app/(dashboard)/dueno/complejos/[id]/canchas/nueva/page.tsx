import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getComplexByOwner } from '@/lib/ownership'
import { CourtBatchForm } from '@/components/court-batch-form'

export default async function NuevaCanchaPage({ params }: PageProps<'/dueno/complejos/[id]/canchas/nueva'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const complejo = await getComplexByOwner(id, session.user.id)
  if (!complejo) redirect('/dueno')

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Nueva cancha</h1>
      <p className="text-muted-foreground mt-1 text-sm">{complejo.nombre}</p>
      <div className="mt-6">
        <CourtBatchForm complejoId={id} />
      </div>
    </main>
  )
}
