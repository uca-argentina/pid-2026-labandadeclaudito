import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/passwords'
import { rolVigente } from '@/lib/rol-vigente'
import {
  borrarIntentos,
  ipDelPedido,
  LOGIN_POR_EMAIL,
  LOGIN_POR_IP,
  registrarIntento,
  superoElLimite,
} from '@/lib/limite-intentos'

// El login la muestra con un mensaje propio (ver resultado.code en login/page.tsx)
class DemasiadosIntentos extends CredentialsSignin {
  code = 'demasiados_intentos'
}

class CuentaSuspendida extends CredentialsSignin {
  code = 'cuenta_suspendida'
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials, request) => {
        const email = credentials.email as string
        const password = credentials.password as string

        const ip = ipDelPedido(request)
        const claveEmail = `login:${email}:${ip}`
        const claveIp = `login-ip:${ip}`
        if (
          (await superoElLimite(claveEmail, LOGIN_POR_EMAIL)) ||
          (await superoElLimite(claveIp, LOGIN_POR_IP))
        ) {
          throw new DemasiadosIntentos()
        }

        const usuario = await db.usuario.findUnique({ where: { email } })
        let loginValido = false
        if (usuario) {
          loginValido = await verifyPassword(password, usuario.passwordHash)
        }

        if (!usuario || !loginValido) {
          await registrarIntento(claveEmail)
          await registrarIntento(claveIp)
          return null
        }

        // Recién con la contraseña correcta se avisa que está suspendida: así
        // no se puede averiguar qué emails están suspendidos sin saber la clave.
        if (!usuario.activo) {
          throw new CuentaSuspendida()
        }

        await borrarIntentos(claveEmail)
        return {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // recién logueado: el rol viene de authorize()
      if (user) {
        token.rol = user.rol
        return token
      }
      // en cada request: devolver null invalida la sesión (Auth.js borra la cookie)
      const rol = await rolVigente(token.sub as string)
      if (!rol) return null
      token.rol = rol
      return token
    },
    session: ({ session, token }) => {
      session.user.rol = token.rol
      session.user.id = token.sub as string
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
