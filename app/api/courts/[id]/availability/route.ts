import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getAvailableSlots } from '@/lib/availability'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const fecha = searchParams.get('fecha')
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return NextResponse.json({ error: 'Fecha inválida, formato YYYY-MM-DD' }, { status: 400 })
  }

  const disponibilidad = await getAvailableSlots(id, new Date(fecha))
  if (!disponibilidad) {
    return NextResponse.json({ error: 'Cancha no encontrada' }, { status: 404 })
  }
  return NextResponse.json(disponibilidad, { status: 200 })
}
