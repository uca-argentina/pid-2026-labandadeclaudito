'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TODOS_LOS_ROLES = 'TODOS'

const roles = {
  [TODOS_LOS_ROLES]: 'Todos los roles',
  JUGADOR: 'Jugadores',
  DUENIO: 'Dueños',
  ADMIN: 'Admins',
}

// Dropdown de rol: al elegir uno actualiza ?rol= en la URL
// y la página (server component) vuelve a pedir los usuarios.
export function RoleFilter({ rol }: { rol: string | undefined }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function elegir(nuevoRol: string) {
    // Conserva los otros filtros y la búsqueda; vuelve a la página 1
    const params = new URLSearchParams(searchParams.toString())
    params.delete('pagina')
    if (nuevoRol === TODOS_LOS_ROLES) params.delete('rol')
    else params.set('rol', nuevoRol)
    router.replace(`/admin/usuarios?${params.toString()}`)
  }

  return (
    <Select value={rol ?? TODOS_LOS_ROLES} onValueChange={(v) => v && elegir(v)}>
      <SelectTrigger className="bg-card w-full sm:w-44" aria-label="Filtrar por rol">
        <SelectValue>{(v: keyof typeof roles) => roles[v]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={TODOS_LOS_ROLES}>Todos los roles</SelectItem>
        <SelectItem value="JUGADOR">Jugadores</SelectItem>
        <SelectItem value="DUENIO">Dueños</SelectItem>
        <SelectItem value="ADMIN">Admins</SelectItem>
      </SelectContent>
    </Select>
  )
}
