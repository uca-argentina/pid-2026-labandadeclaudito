// Sesión falsa que devuelve el auth() simulado (ver tests/setup.ts).
// Cada test elige quién está logueado con loginComo() o sinSesion().

export type SesionDeTest = {
  user: {
    id: string
    name: string
    email: string
    rol: 'JUGADOR' | 'DUENIO'
  }
}

let sesionActual: SesionDeTest | null = null

export function guardarSesion(sesion: SesionDeTest | null) {
  sesionActual = sesion
}

export function obtenerSesion() {
  return sesionActual
}
