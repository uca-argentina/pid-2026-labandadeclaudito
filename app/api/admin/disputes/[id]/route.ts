import { NextResponse } from 'next/server'
import { resolveDisputeSchema } from '@/lib/validations/dispute'
import { requireRole } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

// El admin de la aplicación decide la disputa. La decisión es definitiva: una
// disputa resuelta no se vuelve a editar, queda como registro.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('ADMIN')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params

  const body = await request.json()
  const parsed = resolveDisputeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const disputa = await db.disputa.findUnique({ where: { id } })
  if (!disputa) {
    return NextResponse.json({ error: 'La disputa no existe' }, { status: 404 })
  }
  if (disputa.estado === 'RESUELTA') {
    return NextResponse.json({ error: 'La disputa ya está resuelta' }, { status: 409 })
  }

  await db.$transaction(async (tx) => {
    await tx.disputa.update({
      where: { id },
      data: {
        estado: 'RESUELTA',
        decision: parsed.data.decision,
        comentarioAdmin: parsed.data.comentarioAdmin,
        adminId: session.user.id,
        resueltaEn: new Date(),
      },
    })

    // A favor del jugador: el turno deja de figurar como no-show. La seña no se
    // toca: es parte del pago del turno, no un reembolso.
    if (parsed.data.decision === 'A_FAVOR_JUGADOR') {
      await tx.reserva.update({ where: { id: disputa.reservaId }, data: { asistio: true } })
    }
  })

  return NextResponse.json({ ok: true }, { status: 200 })
}
