import { cache } from 'react'
import { db } from '@/lib/db'

// El JWT guarda el rol del momento del login. Esto lo vuelve a leer de la base
// en cada request: si la cuenta se suspendió o se borró devuelve null (la
// sesión deja de valer) y si le cambiaron el rol devuelve el nuevo.
// cache() de React: el layout y la página llaman los dos a auth() al armar la
// misma pantalla; con cache comparten una sola consulta en vez de hacer dos.
// Dura solo lo que dura ese pedido: el siguiente vuelve a consultar.
export const rolVigente = cache(async (usuarioId: string) => {
  const usuario = await db.usuario.findUnique({
    where: { id: usuarioId },
    select: { activo: true, rol: true },
  })
  if (!usuario || !usuario.activo) return null
  return usuario.rol
})
