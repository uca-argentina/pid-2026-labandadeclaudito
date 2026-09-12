import type { DefaultSession } from 'next-auth'

// Extiende el tipo de sesión de Auth.js para que session.user.rol
// y session.user.id existan y estén tipados en toda la app.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      rol: 'JUGADOR' | 'DUENIO'
    } & DefaultSession['user']
  }

  interface User {
    rol: 'JUGADOR' | 'DUENIO'
  }
}

// next-auth/jwt solo re-exporta @auth/core/jwt — el augment tiene que
// apuntar al módulo donde la interfaz JWT está declarada de verdad,
// si no, TS no hace el merge y token.rol queda como unknown.
declare module '@auth/core/jwt' {
  interface JWT {
    rol: 'JUGADOR' | 'DUENIO'
  }
}
