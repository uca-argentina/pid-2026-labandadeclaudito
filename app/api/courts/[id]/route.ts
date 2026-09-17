import { NextResponse } from 'next/server'
import { Prisma } from '@/lib/generated/prisma/client'
import { updateCourtSchema } from '@/lib/validations/court'
import { requireRole } from '@/lib/auth-helpers'
import { getCourtWithComplex } from '@/lib/ownership'
import { db } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params
  const cancha = await getCourtWithComplex(id)
  if (!cancha || cancha.complejo.duenioId !== session.user.id) {
    return NextResponse.json({ error: 'Cancha no encontrada' }, { status: 404 })
  }

  const body = await request.json()
  const parsed = updateCourtSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const actualizada = await db.cancha.update({
    where: { id },
    data: parsed.data,
  })

  return NextResponse.json({ cancha: actualizada }, { status: 200 })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params
  const cancha = await getCourtWithComplex(id)
  if (!cancha || cancha.complejo.duenioId !== session.user.id) {
    return NextResponse.json({ error: 'Cancha no encontrada' }, { status: 404 })
  }

  try {
    await db.cancha.delete({ where: { id } })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2003') {
      return NextResponse.json(
        { error: 'No se puede borrar: la cancha tiene reservas asociadas' },
        { status: 409 },
      )
    }
    throw e
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
