import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  const rol = req.auth?.user?.rol
  const path = req.nextUrl.pathname

  const esRutaDueno = path.startsWith('/dueno')
  const esRutaJugador = path.startsWith('/jugador')

  if ((esRutaDueno || esRutaJugador) && !req.auth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (esRutaDueno && rol !== 'DUENIO') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (esRutaJugador && rol !== 'JUGADOR') {
    return NextResponse.redirect(new URL('/', req.url))
  }
})

export const config = {
  matcher: ['/dueno/:path*', '/jugador/:path*'],
}
