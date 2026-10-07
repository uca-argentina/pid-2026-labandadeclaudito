import Link from 'next/link'

// Las pantallas de reservas (jugador y dueño) tienen tres pestañas.
// La elegida va en la URL: ?vista=historial|canceladas (sin vista = próximas).
export type VistaDeReservas = 'proximas' | 'historial' | 'canceladas'

const nombres = {
  proximas: 'Próximas',
  historial: 'Historial',
  canceladas: 'Canceladas',
}

// Cualquier valor que no sea historial o canceladas = próximas
export function leerVista(valor: unknown): VistaDeReservas {
  if (valor === 'historial' || valor === 'canceladas') return valor
  return 'proximas'
}

// Link a una pestaña y página de la pantalla de reservas (ruta = la pantalla)
export function urlDeReservas(ruta: string, vista: VistaDeReservas, pagina: number) {
  const params = new URLSearchParams()
  if (vista !== 'proximas') params.set('vista', vista)
  if (pagina > 1) params.set('pagina', String(pagina))
  return `${ruta}?${params.toString()}`
}

// Cambiar de pestaña vuelve siempre a la página 1
export function PestaniasDeReservas({
  ruta,
  vista,
  totales,
}: {
  ruta: string
  vista: VistaDeReservas
  totales: Record<VistaDeReservas, number>
}) {
  const todas: VistaDeReservas[] = ['proximas', 'historial', 'canceladas']

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {todas.map((pestania) => (
        <Link
          key={pestania}
          href={urlDeReservas(ruta, pestania, 1)}
          className={
            pestania === vista
              ? 'bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm'
              : 'border-border hover:bg-muted rounded-full border px-3 py-1 text-sm'
          }
        >
          {nombres[pestania]} ({totales[pestania]})
        </Link>
      ))}
    </div>
  )
}
