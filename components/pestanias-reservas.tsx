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
    <div className="bg-card shadow-soft mb-6 inline-flex flex-wrap gap-1 rounded-2xl p-1">
      {todas.map((pestania) => {
        const elegida = pestania === vista
        return (
          <Link
            key={pestania}
            href={urlDeReservas(ruta, pestania, 1)}
            className={
              elegida
                ? 'bg-sidebar text-sidebar-foreground inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold'
                : 'text-foreground/80 hover:bg-muted inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium'
            }
          >
            {nombres[pestania]}
            <span
              className={
                elegida
                  ? 'bg-highlight text-highlight-foreground inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full px-1.5 text-xs font-bold'
                  : 'bg-muted inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full px-1.5 text-xs font-semibold'
              }
            >
              {totales[pestania]}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
