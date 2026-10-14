import { NextResponse } from 'next/server'
import { decidirComplejoSchema } from '@/lib/validations/complex'
import { requireRole } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

// El admin aprueba o rechaza un complejo que está esperando revisión. Solo se
// deciden los pendientes: uno aprobado no se puede rechazar después (para eso
// está suspender al dueño).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('ADMIN')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params

  const body = await request.json()
  const parsed = decidirComplejoSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  let motivoRechazo: string | null = null
  if (parsed.data.estadoAprobacion === 'RECHAZADO') {
    motivoRechazo = parsed.data.motivoRechazo ?? null
  }

  // El where pide que siga pendiente: si dos admins deciden a la vez, el
  // segundo no actualiza nada y recibe el 409 de abajo.
  const resultado = await db.complejo.updateMany({
    where: { id, activo: true, estadoAprobacion: 'PENDIENTE' },
    data: { estadoAprobacion: parsed.data.estadoAprobacion, motivoRechazo },
  })

  if (resultado.count === 0) {
    const complejo = await db.complejo.findFirst({ where: { id, activo: true } })
    if (!complejo) {
      return NextResponse.json({ error: 'El complejo no existe' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Este complejo ya fue revisado' }, { status: 409 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
