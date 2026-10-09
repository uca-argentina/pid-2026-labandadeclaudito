import { Clock } from 'lucide-react'
import type { Deporte, TipoSuperficie } from '@/lib/generated/prisma/client'
import { deporteLabels, superficieLabels } from '@/lib/labels'
import { DibujoDeCancha } from '@/components/dibujo-de-cancha'

// Cómo va a quedar la cancha mientras se carga el formulario: el dibujo del
// deporte, el deporte y la superficie, y el horario. La usan el alta en lote y
// la edición.
export function VistaPreviaCancha({
  nombre,
  deporte,
  tipoSuperficie,
  horaApertura,
  horaCierre,
  detalle,
}: {
  nombre: string
  deporte: Deporte
  tipoSuperficie: TipoSuperficie
  horaApertura: string
  horaCierre: string
  detalle?: string
}) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      <div className="h-32">
        <DibujoDeCancha deporte={deporte} />
      </div>
      <div className="space-y-1 p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Vista previa
        </p>
        <p className="text-primary text-[11px] font-semibold tracking-wide uppercase">
          {deporteLabels[deporte]} · {superficieLabels[tipoSuperficie]}
        </p>
        <p className="text-lg font-bold">{nombre}</p>
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Clock className="size-3.5 shrink-0" />
          {horaApertura} a {horaCierre} hs
        </p>
        {detalle && <p className="pt-2 text-sm">{detalle}</p>}
      </div>
    </div>
  )
}
