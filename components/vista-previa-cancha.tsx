import { Clock } from 'lucide-react'
import type { Deporte, TipoSuperficie } from '@/lib/generated/prisma/client'
import { deporteLabels, superficieLabels } from '@/lib/labels'
import { DibujoDeCancha } from '@/components/dibujo-de-cancha'
import { colorPorDeporte } from '@/components/etiqueta-deporte'

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
    <div className="bg-card shadow-card overflow-hidden rounded-3xl">
      <div className="h-32">
        <DibujoDeCancha deporte={deporte} />
      </div>
      <div className="p-6 pt-5">
        <p className="bg-muted inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold">
          Vista previa
        </p>
        <p
          className={`mt-3 text-[11px] font-bold tracking-wider uppercase ${colorPorDeporte[deporte]}`}
        >
          {deporteLabels[deporte]} · {superficieLabels[tipoSuperficie]}
        </p>
        <p className="font-heading text-xl font-bold">{nombre}</p>
        <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
          <Clock className="size-3.5 shrink-0" />
          {horaApertura} a {horaCierre} hs
        </p>
        {detalle && <p className="border-border mt-3.5 border-t pt-3.5 text-sm">{detalle}</p>}
      </div>
    </div>
  )
}
