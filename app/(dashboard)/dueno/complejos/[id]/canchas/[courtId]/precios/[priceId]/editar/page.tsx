import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { getComplexByOwner } from '@/lib/ownership'
import { PriceForm } from '@/components/price-form'

export default async function EditarPrecioPage({
  params,
}: PageProps<'/dueno/complejos/[id]/canchas/[courtId]/precios/[priceId]/editar'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id, courtId, priceId } = await params
  const complejo = await getComplexByOwner(id, session.user.id)
  if (!complejo) redirect('/dueno')

  const precioEspecial = await db.precioEspecial.findFirst({
    // cancha.complejoId: que la cancha de la URL sea del complejo que ya validamos
    where: { id: priceId, canchaId: courtId, activo: true, cancha: { complejoId: id } },
    include: { cancha: true },
  })
  if (!precioEspecial) redirect(`/dueno/complejos/${id}/canchas/${courtId}/precios`)

  return (
    <main>
      <h1 className="font-heading text-4xl font-bold tracking-tight">Editar precio especial</h1>
      <div className="mt-6">
        <PriceForm
          complejoId={id}
          courtId={courtId}
          horaApertura={precioEspecial.cancha.horaApertura}
          horaCierre={precioEspecial.cancha.horaCierre}
          precioEspecial={{
            id: precioEspecial.id,
            diaSemana: precioEspecial.diaSemana,
            horaInicio: precioEspecial.horaInicio,
            horaFin: precioEspecial.horaFin,
            precio: precioEspecial.precio.toString(),
          }}
        />
      </div>
    </main>
  )
}
