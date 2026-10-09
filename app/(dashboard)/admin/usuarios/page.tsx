import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Activity, CalendarPlus, CircleDot, IdCard, User, UserCog } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { iniciales } from '@/lib/iniciales'
import { calcularPagina } from '@/lib/paginacion'
import { EstadoVacio } from '@/components/estado-vacio'
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

// Cada rol tiene su color, el mismo para el avatar y para la etiqueta
const estiloPorRol = {
  JUGADOR: { label: 'Jugador', color: 'bg-primary/15 text-primary' },
  DUENIO: { label: 'Dueño', color: 'bg-clay/15 text-clay-foreground' },
  ADMIN: { label: 'Admin', color: 'bg-sidebar text-sidebar-foreground' },
}

// Pestañas del filtro (Todas / Suspendidas), con el mismo estilo que las de
// Reservas: la elegida va en verde oscuro y su contador en amarillo.
function clasePestania(elegida: boolean) {
  return elegida
    ? 'bg-sidebar text-sidebar-foreground inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold'
    : 'text-foreground/80 hover:bg-muted inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium'
}

function claseContador(elegida: boolean) {
  return elegida
    ? 'bg-highlight text-highlight-foreground inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full px-1.5 text-xs font-bold'
    : 'bg-muted inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full px-1.5 text-xs font-semibold'
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

  // El total general va en verde y el de suspendidas en rojo
  const totales = [
    { label: 'Usuarios', valor: totalUsuarios, detalle: 'En la plataforma', color: 'text-primary' },
    { label: 'Jugadores', valor: totalJugadores, detalle: 'Reservan canchas', color: '' },
    { label: 'Dueños', valor: totalDuenios, detalle: 'Administran complejos', color: '' },
    {
      label: 'Suspendidas',
      valor: totalSuspendidos,
      detalle: 'Sin acceso a la cuenta',
      color: 'text-destructive',
    },
  ]

  return (
    <main>
      <h1 className="font-heading text-4xl font-bold tracking-tight">Usuarios</h1>
      <p className="text-muted-foreground mt-1.5 max-w-2xl">
        Una cuenta suspendida no puede iniciar sesión, pierde la sesión abierta y se cancelan sus
        reservas futuras.
      </p>

      {/* Los cuatro totales en una sola tarjeta, separados por una línea */}
      <div className="bg-card shadow-card divide-border mt-6 grid grid-cols-2 gap-y-2 rounded-3xl py-2 sm:grid-cols-4 sm:divide-x">
        {totales.map((total) => (
          <div key={total.label} className="px-6 py-3.5">
            <p className={`font-heading text-4xl font-bold tracking-tight ${total.color}`}>
              {total.valor}
            </p>
            <p className="text-sm font-semibold">{total.label}</p>
            <p className="text-muted-foreground text-sm">{total.detalle}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="bg-card shadow-soft inline-flex gap-1 rounded-2xl p-1">
          <Link href={urlDe({ suspendidas: false })} className={clasePestania(!soloSuspendidas)}>
            Todas
            <span className={claseContador(!soloSuspendidas)}>{totalUsuarios}</span>
          </Link>
          <Link href={urlDe({ suspendidas: true })} className={clasePestania(soloSuspendidas)}>
            Suspendidas
            <span className={claseContador(soloSuspendidas)}>{totalSuspendidos}</span>
          </Link>
        </div>

        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
          <RoleFilter rol={rolElegido} />
          <UserSearch busqueda={busqueda} />
        </div>
      </div>

      {usuarios.length === 0 ? (
        <div className="mt-5">
          <EstadoVacio
            titulo="No encontramos usuarios"
            texto={
              busqueda
                ? `Ningún usuario coincide con "${busqueda}".`
                : 'No hay usuarios con estos filtros.'
            }
          />
        </div>
      ) : (
        <div className="bg-card shadow-card mt-5 overflow-hidden rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">
                  <TituloConIcono icono={User}>Usuario</TituloConIcono>
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <TituloConIcono icono={IdCard}>Rol</TituloConIcono>
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <TituloConIcono icono={CircleDot}>Estado</TituloConIcono>
                </TableHead>
                <TableHead className="hidden xl:table-cell">
                  <TituloConIcono icono={Activity}>Actividad</TituloConIcono>
                </TableHead>
                <TableHead className="hidden xl:table-cell">
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

                return (
                  <TableRow key={usuario.id} className={usuario.activo ? '' : 'bg-destructive/5'}>
                    <TableCell className="pl-4">
                      {/* Hasta xl el nombre se corta para que el botón de la
                          derecha entre sin deslizar la tabla */}
                      <div className="flex max-w-36 items-center gap-3 sm:max-w-48 xl:max-w-none">
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                            usuario.activo ? estilo.color : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {iniciales(usuario.nombre)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{usuario.nombre}</p>
                          <p className="text-muted-foreground truncate text-xs">{usuario.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${estilo.color}`}
                      >
                        {estilo.label}
                      </span>
                    </TableCell>

                    {/* En celular no entra: la fila suspendida ya va en rojo y su
                        botón dice "Reactivar" */}
                    <TableCell className="hidden sm:table-cell">
                      <span
                        className={
                          usuario.activo
                            ? 'inline-flex items-center gap-1.5 font-medium'
                            : 'text-destructive inline-flex items-center gap-1.5 font-semibold'
                        }
                      >
                        <span
                          className={`size-2 rounded-full ${usuario.activo ? 'bg-green-500' : 'bg-destructive'}`}
                        />
                        {usuario.activo ? 'Activa' : 'Suspendida'}
                      </span>
                    </TableCell>

                    {/* A un jugador le importan sus reservas, a un dueño sus complejos */}
                    <TableCell className="text-muted-foreground hidden xl:table-cell">
                      {usuario.rol === 'JUGADOR' &&
                        `${usuario._count.reservas} ${usuario._count.reservas === 1 ? 'reserva' : 'reservas'}`}
                      {usuario.rol === 'DUENIO' &&
                        `${usuario._count.complejos} ${usuario._count.complejos === 1 ? 'complejo' : 'complejos'}`}
                      {usuario.rol === 'ADMIN' && '—'}
                    </TableCell>

                    <TableCell className="text-muted-foreground hidden xl:table-cell">
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
