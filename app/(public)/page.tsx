import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { homePorRol } from '@/lib/home-por-rol'

export default async function HomePage() {
  const session = await auth()

  if (!session) redirect('/login')

  redirect(homePorRol(session.user.rol))
}
