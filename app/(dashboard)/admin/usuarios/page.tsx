import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Activity,
  Building2,
  CalendarPlus,
  CircleDot,
  IdCard,
  ShieldCheck,
  User,
  UserCog,
  UserX,
  Users,
} from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { iniciales } from '@/lib/iniciales'
import { calcularPagina } from '@/lib/paginacion'
import { StatCard } from '@/components/stat-card'
import { TituloConIcono } from '@/components/titulo-con-icono'
import { Paginacion } from '@/components/paginacion'
import { UserSearch } from '@/components/user-search'
import { RoleFilter } from '@/components/role-filter'
import { SuspendUserButton } from '@/components/suspend-user-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const USUARIOS_POR_PAGINA = 20

// Cada rol tiene su color: el avatar y la etiqueta.
const estiloPorRol = {
  JUGADOR: {
    label: 'Jugador',
    icono: User,
    avatar: 'bg-emerald-600 text-white',
    etiqueta: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  },
  DUENIO: {
    label: 'Dueño',
    icono: Building2,
    avatar: 'bg-amber-600 text-white',
    etiqueta: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  },
  ADMIN: {
    label: 'Admin',
    icono: ShieldCheck,
    avatar: 'bg-violet-600 text-white',
    etiqueta: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  },
}

// Botón de filtro: relleno si está elegido, con borde si no
function clasePill(elegido: boolean) {
  return elegido
    ? 'bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm'
    : 'border-border hover:bg-muted rounded-full border px-3 py-1 text-sm'
}

export default async function AdminUsuariosPage({ searchParams }: PageProps<'/admin/usuarios'>) {
  const session = await auth()
  if (!session) redirect('/login')

  // Todo el estado de la pantalla vive en la URL:
  // ?filtro=suspendidas  solo las cuentas suspendidas
  // ?rol=JUGADOR        solo los usuarios de ese rol
  // ?q=texto             busca por nombre o email
  // ?pagina=2            qué página de resultados mostrar
  const { filtro, rol, q, pagina } = await searchParams
  const soloSuspendidas = filtro === 'suspendidas'
  const busqueda = typeof q === 'string' ? q.trim() : ''
  // Solo aceptamos roles que existen; cualquier otra cosa = todos los roles
  let rolElegido: 'JUGADOR' | 'DUENIO' | 'ADMIN' | undefined
  if (rol === 'JUGADOR' || rol === 'DUENIO' || rol === 'ADMIN') rolElegido = rol

  // La búsqueda y el filtro los resuelve la base, no JavaScript
  const where = {
    activo: soloSuspendidas ? false : undefined,
    rol: rolElegido,
    OR: busqueda
      ? [
          { nombre: { contains: busqueda, mode: 'insensitive' as const } },
          { email: { contains: busqueda, mode: 'insensitive' as const } },
        ]
      : undefined,
  }

  // Los totales también los cuenta la base, sin traer los usuarios
  const [totalUsuarios, totalJugadores, totalDuenios, totalSuspendidos, totalEncontrados] =
    await Promise.all([
      db.usuario.count(),
      db.usuario.count({ where: { rol: 'JUGADOR' } }),
      db.usuario.count({ where: { rol: 'DUENIO' } }),
      db.usuario.count({ where: { activo: false } }),
      db.usuario.count({ where }),
    ])

  const { paginaActual, totalPaginas, skip } = calcularPagina(
    pagina,
    totalEncontrados,
    USUARIOS_POR_PAGINA,
  )

  // Solo los usuarios de esta página, y solo los campos que se muestran
  const usuarios = await db.usuario.findMany({
    where,
    orderBy: { nombre: 'asc' },
    skip,
    take: USUARIOS_POR_PAGINA,
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      createdAt: true,
      _count: { select: { reservas: true, complejos: true } },
    },
  })

  // Arma un link a esta misma pantalla: conserva búsqueda y rol,
  // y cambia solo lo que se le pasa. Sin pagina = vuelve a la página 1.
  function urlDe(cambios: { suspendidas?: boolean; pagina?: number }) {
    const suspendidas = cambios.suspendidas ?? soloSuspendidas
    const paginaDelLink = cambios.pagina ?? 1

    const params = new URLSearchParams()
    if (suspendidas) params.set('filtro', 'suspendidas')
    if (rolElegido) params.set('rol', rolElegido)
    if (busqueda) params.set('q', busqueda)
    if (paginaDelLink > 1) params.set('pagina', String(paginaDelLink))
    return `/admin/usuarios?${params.toString()}`
  }

  return (
    <main className="px-6 pt-6 pb-12 md:pt-4">
      <h1 className="text-3xl font-semibold tracking-tight">Usuarios</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Una cuenta suspendida no puede iniciar sesión, pierde la sesión abierta y se cancelan sus
        reservas futuras.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Usuarios" value={totalUsuarios} detalle="En la plataforma" />
        <StatCard icon={User} label="Jugadores" value={totalJugadores} detalle="Reservan canchas" />
        <StatCard
          icon={Building2}
          label="Dueños"
          value={totalDuenios}
          detalle="Administran complejos"
        />
        <StatCard
          icon={UserX}
          label="Suspendidas"
          value={totalSuspendidos}
          detalle="Sin acceso a la cuenta"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Link href={urlDe({ suspendidas: false })} className={clasePill(!soloSuspendidas)}>
            Todas ({totalUsuarios})
          </Link>
          <Link href={urlDe({ suspendidas: true })} className={clasePill(soloSuspendidas)}>
            Suspendidas ({totalSuspendidos})
          </Link>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <RoleFilter rol={rolElegido} />
          <UserSearch busqueda={busqueda} />
        </div>
      </div>

      {usuarios.length === 0 ? (
        <p className="text-muted-foreground mt-8 text-sm">
          {busqueda
            ? `Ningún usuario coincide con "${busqueda}".`
            : 'No hay usuarios con estos filtros.'}
        </p>
      ) : (
        <div className="border-border bg-card mt-6 overflow-hidden rounded-2xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">
                  <TituloConIcono icono={User}>Usuario</TituloConIcono>
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <TituloConIcono icono={IdCard}>Rol</TituloConIcono>
                </TableHead>
                <TableHead>
                  <TituloConIcono icono={CircleDot}>Estado</TituloConIcono>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <TituloConIcono icono={Activity}>Actividad</TituloConIcono>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <TituloConIcono icono={CalendarPlus}>Alta</TituloConIcono>
                </TableHead>
                <TableHead className="pr-4 text-right">
                  <TituloConIcono icono={UserCog}>Acción</TituloConIcono>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => {
                const estilo = estiloPorRol[usuario.rol]
                const IconoRol = estilo.icono

                return (
                  <TableRow key={usuario.id} className={usuario.activo ? '' : 'bg-destructive/5'}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            usuario.activo ? estilo.avatar : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {iniciales(usuario.nombre)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{usuario.nombre}</p>
                          <p className="text-muted-foreground truncate text-xs">{usuario.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${estilo.etiqueta}`}
                      >
                        <IconoRol className="size-3" />
                        {estilo.label}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          usuario.activo
                            ? 'bg-green-500/15 text-green-700 dark:text-green-300'
                            : 'bg-destructive/15 text-destructive'
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${usuario.activo ? 'bg-green-500' : 'bg-destructive'}`}
                        />
                        {usuario.activo ? 'Activa' : 'Suspendida'}
                      </span>
                    </TableCell>

                    {/* A un jugador le importan sus reservas, a un dueño sus complejos */}
                    <TableCell className="text-muted-foreground hidden lg:table-cell">
                      {usuario.rol === 'JUGADOR' &&
                        `${usuario._count.reservas} ${usuario._count.reservas === 1 ? 'reserva' : 'reservas'}`}
                      {usuario.rol === 'DUENIO' &&
                        `${usuario._count.complejos} ${usuario._count.complejos === 1 ? 'complejo' : 'complejos'}`}
                      {usuario.rol === 'ADMIN' && '—'}
                    </TableCell>

                    <TableCell className="text-muted-foreground hidden lg:table-cell">
                      {usuario.createdAt.toLocaleDateString('es-AR', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>

                    {/* El admin no puede suspenderse a sí mismo */}
                    <TableCell className="pr-4 text-right">
                      {usuario.id === session.user.id ? (
                        <span className="text-muted-foreground text-xs">Tu cuenta</span>
                      ) : (
                        <SuspendUserButton
                          userId={usuario.id}
                          userName={usuario.nombre}
                          activo={usuario.activo}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            desde={skip + 1}
            hasta={skip + usuarios.length}
            total={totalEncontrados}
            urlAnterior={urlDe({ pagina: paginaActual - 1 })}
            urlSiguiente={urlDe({ pagina: paginaActual + 1 })}
          />
        </div>
      )}
    </main>
  )
}
