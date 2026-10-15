import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updateProfileSchema } from '@/lib/validations/user'
import { db } from '@/lib/db'

// Editar el propio perfil. No se usa requireRole porque vale cualquier rol
// logueado, menos el admin: es una cuenta de la app, no tiene perfil.
export async function PATCH(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }
  if (session.user.rol === 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const body = await request.json()

  const parsed = updateProfileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    await db.usuario.update({
      // el id sale de la sesión, nunca del body
      where: { id: session.user.id },
      data: {
        nombre: parsed.data.nombre,
        email: parsed.data.email,
        telefono: parsed.data.telefono,
        dni: parsed.data.dni,
      },
    })
  } catch {
    // email y dni son únicos: el único error esperable es que ya los tenga otro
    return NextResponse.json({ error: 'Ese email o DNI ya está en uso' }, { status: 409 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
