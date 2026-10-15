import { NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/user'
import { hashPassword } from '@/lib/passwords'
import { db } from '@/lib/db'
import {
  ipDelPedido,
  registrarIntento,
  REGISTRO_POR_IP,
  superoElLimite,
} from '@/lib/limite-intentos'

export async function POST(request: Request) {
  // Se cuenta cada intento de registro, salga bien o no: frena la creación
  // masiva de cuentas y probar emails para ver cuáles ya existen.
  const clave = `registro:${ipDelPedido(request)}`
  if (await superoElLimite(clave, REGISTRO_POR_IP)) {
    return NextResponse.json(
      { error: 'Demasiados registros desde esta conexión. Probá de nuevo en una hora.' },
      { status: 429 },
    )
  }

  const body = await request.json()

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  await registrarIntento(clave)
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
