import { NextResponse } from 'next/server'
import { createPriceSchema } from '@/lib/validations/price'
import { requireRole } from '@/lib/auth-helpers'
import { getCourtWithComplex } from '@/lib/ownership'
import { preciosChocan } from '@/lib/availability'
import { franjaDentroDelHorario, mensajeFueraDelHorario } from '@/lib/time'
import { db } from '@/lib/db'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id: courtId } = await params
  const cancha = await getCourtWithComplex(courtId)
  if (!cancha || cancha.complejo.duenioId !== session.user.id) {
    return NextResponse.json({ error: 'Cancha no encontrada' }, { status: 404 })
  }

  const body = await request.json()
  const parsed = createPriceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const { horaInicio, horaFin } = parsed.data
  if (
    horaInicio !== null &&
    !franjaDentroDelHorario(horaInicio, horaFin!, cancha.horaApertura, cancha.horaCierre)
  ) {
    return NextResponse.json(
      { error: mensajeFueraDelHorario(cancha.horaApertura, cancha.horaCierre) },
      { status: 400 },
    )
  }

  const otrosPrecios = await db.precioEspecial.findMany({
    where: { canchaId: courtId, activo: true },
  })
  if (otrosPrecios.some((otro) => preciosChocan(parsed.data, otro))) {
    return NextResponse.json(
      { error: 'Ya hay un precio especial para ese día y horario' },
      { status: 409 },
    )
  }

  const precioEspecial = await db.precioEspecial.create({
    data: { ...parsed.data, canchaId: courtId },
  })

  return NextResponse.json({ precioEspecial }, { status: 201 })
}
