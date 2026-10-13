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

  const bloqueo = await db.block.findFirst({
    // court.complejoId: que la cancha de la URL sea del complejo que ya validamos
    where: { id: blockId, courtId, court: { complejoId: id } },
    include: { court: true },
  })
  if (!bloqueo) redirect(`/dueno/complejos/${id}/canchas/${courtId}/bloqueos`)

  return (
    <main>
      <h1 className="font-heading text-4xl font-bold tracking-tight">Editar bloqueo</h1>
      <div className="mt-6">
        <BlockForm
          complejoId={id}
          courtId={courtId}
          horaApertura={bloqueo.court.horaApertura}
          horaCierre={bloqueo.court.horaCierre}
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
