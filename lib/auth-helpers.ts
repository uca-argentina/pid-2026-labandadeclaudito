import { auth } from '@/auth'

export async function requireRole(rol: 'JUGADOR' | 'DUENIO') {
  const session = await auth()

  if (!session) {
    return { session: null, error: 'No autenticado', status: 401 } as const
  }

  if (session.user.rol !== rol) {
    return { session: null, error: 'No autorizado', status: 403 } as const
  }

  return { session, error: null, status: 200 } as const
}
