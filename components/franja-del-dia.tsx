import { posicionEnElDia, tramosAbiertos } from '@/lib/franja'

const MINUTOS_DEL_DIA = 24 * 60

// Barra de un día entero: en gris, cuándo está abierta la cancha; encima, la
// franja que se está cargando (precio especial o bloqueo).
export function FranjaDelDia({
  horaApertura,
  horaCierre,
  desde,
  hasta,
  color,
}: {
  horaApertura: string
  horaCierre: string
  desde: string
  hasta: string
  color: 'primary' | 'destructive'
}) {
  const franja = posicionEnElDia(desde, hasta)

  return (
    <div>
      <div className="bg-muted relative h-6 overflow-hidden rounded-md">
        {tramosAbiertos(horaApertura, horaCierre).map((tramo) => (
          <div
            key={tramo.desde}
            className="bg-secondary-foreground/15 absolute inset-y-0"
            style={{
              left: `${(tramo.desde / MINUTOS_DEL_DIA) * 100}%`,
              width: `${((tramo.hasta - tramo.desde) / MINUTOS_DEL_DIA) * 100}%`,
            }}
          />
        ))}
        <div
          className={`absolute inset-y-0 rounded-sm ${color === 'primary' ? 'bg-primary' : 'bg-destructive'}`}
          style={{ left: `${franja.izquierda}%`, width: `${franja.ancho}%` }}
        />
      </div>
      <div className="text-muted-foreground mt-1 flex justify-between text-[11px] tabular-nums">
        <span>00</span>
        <span>06</span>
        <span>12</span>
        <span>18</span>
        <span>24</span>
      </div>
    </div>
  )
}
