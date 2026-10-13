import type { GrupoDeEstado } from '@/lib/admin-bookings'
import { grupoDeEstadoLabels } from '@/lib/labels'

// El orden sigue el día: las ya jugadas, la que se está jugando, las que
// vienen y al final las que se cayeron. Así ningún verde queda pegado al
// arcilla o al rojo (con daltonismo se confunden). Colores en globals.css.
const estadosEnLaBarra: { grupo: GrupoDeEstado; color: string }[] = [
  { grupo: 'NO_SHOW', color: 'bg-estado-no-show' },
  { grupo: 'FINALIZADA', color: 'bg-estado-finalizada' },
  { grupo: 'EN_CURSO', color: 'bg-estado-en-curso' },
  { grupo: 'CONFIRMADA', color: 'bg-estado-confirmada' },
  { grupo: 'PENDIENTE', color: 'bg-estado-pendiente' },
  { grupo: 'CANCELADA', color: 'bg-estado-cancelada' },
]

// Barra apilada con cuántas reservas hay en cada estado, y abajo la leyenda
// con el número de cada uno (el color nunca es la única pista).
export function RepartoDeReservas({ conteo }: { conteo: Record<GrupoDeEstado, number> }) {
  let total = 0
  for (const estado of estadosEnLaBarra) {
    total += conteo[estado.grupo]
  }

  // @container: la leyenda elige 2 o 3 columnas según el ancho de la tarjeta
  return (
    <div className="@container">
      {total === 0 ? (
        <div className="bg-muted h-3 rounded-full" />
      ) : (
        <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
          {estadosEnLaBarra.map((estado) => {
            const cantidad = conteo[estado.grupo]
            if (cantidad === 0) return null
            const porcentaje = Math.round((cantidad / total) * 100)
            return (
              <div
                key={estado.grupo}
                className={estado.color}
                style={{ width: `${(cantidad / total) * 100}%` }}
                title={`${grupoDeEstadoLabels[estado.grupo]}: ${cantidad} (${porcentaje}%)`}
              />
            )
          })}
        </div>
      )}

      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 @lg:grid-cols-3 text-sm">
        {estadosEnLaBarra.map((estado) => (
          <li key={estado.grupo} className="flex items-center gap-2">
            <span className={`size-2.5 shrink-0 rounded-full ${estado.color}`} />
            <span className="text-muted-foreground truncate">
              {grupoDeEstadoLabels[estado.grupo]}
            </span>
            <span className="ml-auto font-semibold tabular-nums">{conteo[estado.grupo]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
