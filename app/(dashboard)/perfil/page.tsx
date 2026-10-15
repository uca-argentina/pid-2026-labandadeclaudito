import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { PerfilForm } from '@/components/perfil-form'
import { homePorRol } from '@/lib/home-por-rol'

// Única pantalla de perfil para jugador y dueño (el proxy deja pasar /perfil
// para cualquier rol). El admin es una cuenta de la app: no tiene perfil.
export default async function PerfilPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.rol === 'ADMIN') redirect('/admin')

  const usuario = await db.usuario.findUnique({
    where: { id: session.user.id },
    select: { nombre: true, email: true, telefono: true, dni: true, imagenUrl: true },
  })
  if (!usuario) redirect('/login')

  return (
    <main>
      <h1 className="font-heading text-4xl font-bold tracking-tight">Mi perfil</h1>
      <p className="text-muted-foreground mt-1">
        Cambiá tus datos y tu foto. Así te ven en TocaYJuga.
      </p>
      <div className="mt-6 max-w-3xl">
        <PerfilForm usuario={usuario} volverA={homePorRol(session.user.rol)} />
      </div>
    </main>
  )
}
