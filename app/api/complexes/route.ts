import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createComplexSchema } from '@/lib/validations/complex'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }
  // proxy.ts no cubre /api, así que el rol se chequea acá
  if (session.user.rol !== 'DUENIO') {
    return NextResponse.json({ error: 'Solo los dueños pueden crear complejos' }, { status: 403 })
  }

  const body = await request.json()

  const parsed = createComplexSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const complejo = await db.complejo.create({
    data: {
      nombre: parsed.data.nombre,
      direccion: parsed.data.direccion,
      zona: parsed.data.zona,
      contacto: parsed.data.contacto,
      porcentajeSenaDefault: parsed.data.porcentajeSenaDefault,
      duenioId: session.user.id,
    },
  })

  return NextResponse.json({ id: complejo.id }, { status: 201 })
}
