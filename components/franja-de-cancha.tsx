import type { Deporte } from '@/lib/generated/prisma/client'
import { DibujoDeCancha } from '@/components/dibujo-de-cancha'

// Franja angosta con la cancha del deporte, para arriba de una tarjeta. El
// dibujo de la cancha es vertical: acá se lo gira 90 grados y se muestra solo
// la parte del medio (la línea central y el círculo).
export function FranjaDeCancha({ deporte }: { deporte: Deporte }) {
  return (
    <div aria-hidden className="relative h-11 shrink-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 h-96 w-60 -translate-x-1/2 -translate-y-1/2 rotate-90">
        <DibujoDeCancha deporte={deporte} />
      </div>
    </div>
  )
}
