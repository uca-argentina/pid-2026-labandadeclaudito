import { NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/user'
import { hashPassword } from '@/lib/passwords'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json()

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const passwordHash = await hashPassword(parsed.data.password)

  try {
    await db.usuario.create({
      data: {
        nombre: parsed.data.nombre,
        email: parsed.data.email,
        passwordHash: passwordHash,
        rol: parsed.data.rol,
      },
    })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Email ya registrado' }, { status: 409 })
  }
}
