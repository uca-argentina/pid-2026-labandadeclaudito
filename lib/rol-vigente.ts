import { db } from '@/lib/db'

// El JWT guarda el rol del momento del login. Esto lo vuelve a leer de la base
// en cada request: si la cuenta se suspendió o se borró devuelve null (la
// sesión deja de valer) y si le cambiaron el rol devuelve el nuevo.
// ponytail: una consulta por cada auth(); cachear por request si pesa.
export async function rolVigente(usuarioId: string) {
  const usuario = await db.usuario.findUnique({
    where: { id: usuarioId },
    select: { activo: true, rol: true },
  })
  if (!usuario || !usuario.activo) return null
  return usuario.rol
}
