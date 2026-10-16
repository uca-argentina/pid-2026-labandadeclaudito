import { Info } from 'lucide-react'
import type { DecisionDisputa, EstadoDisputa, Rol } from '@/lib/generated/prisma/client'
import { decisionDisputaLabels, estadoDisputaCorto } from '@/lib/labels'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type DisputaParaMostrar = {
  estado: EstadoDisputa
  decision: DecisionDisputa | null
  comentarioAdmin: string | null
}

const estilos = {
  ABIERTA: 'bg-accent text-accent-foreground',
  GANADA: 'bg-green-600/15 text-green-700 dark:text-green-500',
  PERDIDA: 'bg-destructive/15 text-destructive',
  NEUTRAL: 'bg-muted text-muted-foreground',
}

const clasesDelPill = 'inline-flex items-center gap-1.5 rounded-2xl px-2.5 py-1 text-xs font-medium'

// Verde si la disputa salió a favor de quien la mira, rojo si salió en contra.
// El admin no es parte, así que lo ve neutro.
function estiloDeDecision(decision: DecisionDisputa, vista: Rol) {
  if (vista === 'ADMIN') return estilos.NEUTRAL
  const aFavorMio = decision === (vista === 'DUENIO' ? 'A_FAVOR_DUENIO' : 'A_FAVOR_JUGADOR')
  return aFavorMio ? estilos.GANADA : estilos.PERDIDA
}

// Lo que se ve de una disputa en el historial: un pill con en qué está. La
// explicación del admin es un texto largo que descuadraba la fila de la tabla,
// así que se lee en un globo que se abre al tocar el pill.
export function EstadoDeDisputa({ disputa, vista }: { disputa: DisputaParaMostrar; vista: Rol }) {
  if (!disputa.decision || !disputa.comentarioAdmin) {
    return (
      <span className={`${clasesDelPill} ${estilos.ABIERTA}`}>
        {estadoDisputaCorto[disputa.estado]}
      </span>
    )
  }

  return (
    <Popover>
      <PopoverTrigger className={`${clasesDelPill} ${estiloDeDecision(disputa.decision, vista)}`}>
        {estadoDisputaCorto.RESUELTA}
        <Info className="size-3.5 shrink-0" />
      </PopoverTrigger>

      {/* whitespace-normal: adentro de una celda de tabla (que es nowrap) el
          comentario del admin no se partía en varios renglones */}
      <PopoverContent
        align="end"
        className="w-64 gap-1 rounded-2xl p-3 text-left whitespace-normal"
      >
        <p className="font-semibold">{decisionDisputaLabels[disputa.decision]}</p>
        <p className="text-muted-foreground break-words">{disputa.comentarioAdmin}</p>
      </PopoverContent>
    </Popover>
  )
}
