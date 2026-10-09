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
    <main>
      <p className="text-muted-foreground text-sm font-medium">
        {complejo.nombre} · {cancha.nombre}
      </p>
      <h1 className="font-heading mt-1 text-4xl font-bold tracking-tight">Nuevo bloqueo</h1>
      <div className="mt-6">
        <BlockForm
          complejoId={id}
          courtId={courtId}
          horaApertura={cancha.horaApertura}
          horaCierre={cancha.horaCierre}
        />
      </div>
    </main>
  )
}
