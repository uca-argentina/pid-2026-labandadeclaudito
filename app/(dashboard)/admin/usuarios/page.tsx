import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { SuspendUserButton } from '@/components/suspend-user-button'

const rolLabels = {
  JUGADOR: 'Jugador',
  DUENIO: 'Dueño',
  ADMIN: 'Admin',
}

export default async function AdminUsuariosPage({ searchParams }: PageProps<'/admin/usuarios'>) {
  const session = await auth()
  if (!session) redirect('/login')

  // ?filtro=suspendidas muestra solo las cuentas suspendidas
  const { filtro } = await searchParams
  const soloSuspendidas = filtro === 'suspendidas'

  const usuarios = await db.usuario.findMany({
    where: soloSuspendidas ? { activo: false } : undefined,
    orderBy: { nombre: 'asc' },
  })

  return (
    <main className="mx-auto max-w-5xl px-6 pt-6 pb-12 md:pt-4">
      <h1 className="text-3xl font-semibold">Usuarios</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Una cuenta suspendida no puede iniciar sesión, pierde la sesión abierta y se cancelan sus
        reservas futuras.
      </p>

      <div className="mt-6 flex gap-2">
        <Link
          href="/admin/usuarios"
          className={
            soloSuspendidas
              ? 'border-border rounded-full border px-3 py-1 text-sm'
              : 'bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm'
          }
        >
          Todas
        </Link>
        <Link
          href="/admin/usuarios?filtro=suspendidas"
          className={
            soloSuspendidas
              ? 'bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm'
              : 'border-border rounded-full border px-3 py-1 text-sm'
          }
        >
          Suspendidas
        </Link>
      </div>

      {usuarios.length === 0 ? (
        <p className="text-muted-foreground mt-8 text-sm">
          {soloSuspendidas ? 'No hay cuentas suspendidas.' : 'No hay usuarios.'}
        </p>
      ) : (
        <div className="border-border bg-card divide-border mt-6 divide-y rounded-2xl border">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{usuario.nombre}</span>
                  <Badge variant="secondary">{rolLabels[usuario.rol]}</Badge>
                  {!usuario.activo && <Badge variant="destructive">Suspendida</Badge>}
                </div>
                <p className="text-muted-foreground truncate text-sm">{usuario.email}</p>
              </div>
              {/* El admin no puede suspenderse a sí mismo */}
              {usuario.id !== session.user.id && (
                <SuspendUserButton
                  userId={usuario.id}
                  userName={usuario.nombre}
                  activo={usuario.activo}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
