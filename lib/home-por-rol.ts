// Página de inicio de cada rol: a dónde mandar al usuario después del login
// y a dónde redirigirlo si entra a una sección que no es la suya.
export function homePorRol(rol: 'JUGADOR' | 'DUENIO' | 'ADMIN') {
  if (rol === 'ADMIN') return '/admin'
  if (rol === 'DUENIO') return '/dueno'
  return '/jugador'
}
