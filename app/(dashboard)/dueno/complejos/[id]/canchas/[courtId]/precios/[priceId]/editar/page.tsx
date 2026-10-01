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
    where: { id: priceId, canchaId: courtId, activo: true },
  })
  if (!precioEspecial) redirect(`/dueno/complejos/${id}/canchas/${courtId}/precios`)

  return (
    <main className="mx-auto max-w-2xl px-6 pt-6 pb-12 md:pt-4">
      <h1 className="text-3xl font-semibold">Editar precio especial</h1>
      <div className="mt-6">
        <PriceForm
          complejoId={id}
          courtId={courtId}
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
