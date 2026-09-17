import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { complexImageSchema, MAX_IMAGES_PER_COMPLEX } from '@/lib/validations/complex'
import { requireRole } from '@/lib/auth-helpers'
import { getComplexByOwner } from '@/lib/ownership'
import { db } from '@/lib/db'

// Se sube una foto por request: Vercel corta los bodies de más de 4.5 MB.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id: complejoId } = await params

  const complejo = await getComplexByOwner(complejoId, session.user.id)
  if (!complejo) {
    return NextResponse.json({ error: 'Complejo no encontrado' }, { status: 404 })
  }

  const formData = await request.formData()
  const parsed = complexImageSchema.safeParse({ imagen: formData.get('imagen') })
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const cantidadDeFotos = await db.imagenComplejo.count({ where: { complejoId } })
  if (cantidadDeFotos >= MAX_IMAGES_PER_COMPLEX) {
    return NextResponse.json({ error: 'El complejo ya tiene 5 fotos' }, { status: 409 })
  }

  const archivo = parsed.data.imagen
  const blob = await put(`complejos/${complejoId}/${archivo.name}`, archivo, {
    access: 'public',
    addRandomSuffix: true,
  })

  const imagen = await db.imagenComplejo.create({
    data: { complejoId, url: blob.url, orden: cantidadDeFotos },
  })

  return NextResponse.json({ id: imagen.id, url: imagen.url }, { status: 201 })
}
