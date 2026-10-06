import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { homePorRol } from '@/lib/home-por-rol'

export default auth((req) => {
  // el matcher de abajo hace que esto solo corra en /jugador, /dueno y /admin
  if (!req.auth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // cada rol solo puede entrar a su sección: si no es la suya, lo mandamos a su inicio
  const home = homePorRol(req.auth.user.rol)
  if (!req.nextUrl.pathname.startsWith(home)) {
    return NextResponse.redirect(new URL(home, req.url))
  }
})

export const config = {
  matcher: ['/dueno/:path*', '/jugador/:path*', '/admin/:path*'],
}
