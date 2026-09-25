import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { getComplexByOwner } from '@/lib/ownership'
import { diaDeReserva } from '@/lib/time'
import { BlockForm } from '@/components/block-form'

export default async function EditarBloqueoPage({
  params,
}: PageProps<'/dueno/complejos/[id]/canchas/[courtId]/bloqueos/[blockId]/editar'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id, courtId, blockId } = await params
  const complejo = await getComplexByOwner(id, session.user.id)
  if (!complejo) redirect('/dueno')

  const bloqueo = await db.block.findFirst({ where: { id: blockId, courtId } })
  if (!bloqueo) redirect(`/dueno/complejos/${id}/canchas/${courtId}/bloqueos`)

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Editar bloqueo</h1>
      <div className="mt-6">
        <BlockForm
          complejoId={id}
          courtId={courtId}
          block={{
            id: bloqueo.id,
            startDate: diaDeReserva(bloqueo.startDate),
            endDate: diaDeReserva(bloqueo.endDate),
            startTime: bloqueo.startTime,
            endTime: bloqueo.endTime,
            reason: bloqueo.reason ?? '',
          }}
        />
      </div>
    </main>
  )
}
