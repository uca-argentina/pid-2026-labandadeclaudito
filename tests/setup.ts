import 'dotenv/config'
import { vi } from 'vitest'

// auth() real necesita cookies y NextAuth: se reemplaza por uno que devuelve
// la sesión que eligió el test.
vi.mock('@/auth', async () => {
  const sesion = await import('./sesion')
  return {
    auth: async () => sesion.obtenerSesion(),
  }
})

// No subir ni borrar archivos reales en Vercel Blob.
vi.mock('@vercel/blob', () => {
  return {
    put: vi.fn(async (pathname: string) => {
      return { url: `https://test.public.blob.vercel-storage.com/${pathname}` }
    }),
    del: vi.fn(async () => {}),
  }
})
