import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/passwords'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials.email as string
        const password = credentials.password as string

        const usuario = await db.usuario.findUnique({ where: { email } })
        if (!usuario) return null

        const passwordValida = await verifyPassword(password, usuario.passwordHash)
        if (!passwordValida) return null

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
    jwt: ({ token, user }) => {
      if (user) token.rol = user.rol
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
