import { redirect } from 'next/navigation'
import { auth } from '@/auth'

// ponytail: página mínima para que el layout /admin exista;
// el panel con métricas globales es SCRUM-65
export default async function AdminHomePage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="max-w-5xl px-6 pt-6 pb-12 md:pt-4">
      <h1 className="text-3xl font-semibold tracking-tight">Hola, {session.user.name}</h1>
      <p className="text-muted-foreground mt-2">
        Administrá usuarios, complejos y disputas de la plataforma.
      </p>
    </div>
  )
}
