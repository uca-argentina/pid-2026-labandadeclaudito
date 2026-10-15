import { db } from '@/lib/db'

// Límites contra fuerza bruta. Cada intento se guarda como una fila de
// Intento con una clave; si en la ventana de tiempo hay demasiadas filas con
// esa clave, se corta.
// ponytail: las filas viejas no se borran solas; agregar limpieza si la tabla crece.

// Login: 5 fallos para el mismo email desde la misma IP...
export const LOGIN_POR_EMAIL = { maximo: 5, minutos: 15 }
// ...y 20 fallos desde una misma IP probando emails distintos
export const LOGIN_POR_IP = { maximo: 20, minutos: 15 }
// Registro: 5 cuentas nuevas por IP por hora
export const REGISTRO_POR_IP = { maximo: 5, minutos: 60 }

export async function superoElLimite(clave: string, limite: { maximo: number; minutos: number }) {
  const desde = new Date(Date.now() - limite.minutos * 60 * 1000)
  const cantidad = await db.intento.count({
    where: { clave, createdAt: { gte: desde } },
  })
  return cantidad >= limite.maximo
}

export async function registrarIntento(clave: string) {
  await db.intento.create({ data: { clave } })
}

export async function borrarIntentos(clave: string) {
  await db.intento.deleteMany({ where: { clave } })
}

// En Vercel, x-forwarded-for trae la IP real del cliente: Vercel lo pisa y no
// deja pasar uno que mande el cliente. En `next dev` viene como ::1.
export function ipDelPedido(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (!forwardedFor) return 'local'
  return forwardedFor.split(',')[0].trim()
}
