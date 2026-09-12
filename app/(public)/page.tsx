import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export default async function HomePage() {
  const session = await auth()

  if (!session) redirect('/login')

  redirect(session.user.rol === 'DUENIO' ? '/dueno' : '/jugador')
}
