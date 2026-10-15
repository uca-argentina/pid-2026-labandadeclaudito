import type { DecisionDisputa, EstadoDisputa, Rol } from '@/lib/generated/prisma/client'
import { decisionDisputaLabels, estadoDisputaLabels } from '@/lib/labels'

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

// Verde si la disputa salió a favor de quien la mira, rojo si salió en contra.
// El admin no es parte, así que lo ve neutro.
function estiloDeDecision(decision: DecisionDisputa, vista: Rol) {
  if (vista === 'ADMIN') return estilos.NEUTRAL
  const aFavorMio = decision === (vista === 'DUENIO' ? 'A_FAVOR_DUENIO' : 'A_FAVOR_JUGADOR')
  return aFavorMio ? estilos.GANADA : estilos.PERDIDA
}

// Lo que se ve de una disputa en el historial: en qué está y, si ya se
// resolvió, qué decidió el administrador y por qué.
export function EstadoDeDisputa({ disputa, vista }: { disputa: DisputaParaMostrar; vista: Rol }) {
  const estilo = disputa.decision ? estiloDeDecision(disputa.decision, vista) : estilos.ABIERTA
  const texto = disputa.decision
    ? `${estadoDisputaLabels.RESUELTA}: ${decisionDisputaLabels[disputa.decision]}`
    : estadoDisputaLabels.ABIERTA

  // whitespace-normal: adentro de una celda de tabla (que es nowrap) el
  // comentario del admin no se partía y se metía en la columna de al lado
  return (
    <div className="ml-auto max-w-56 text-right whitespace-normal">
      <span className={`inline-block rounded-2xl px-2.5 py-1 text-xs font-medium ${estilo}`}>
        {texto}
      </span>
      {disputa.comentarioAdmin && (
        <p className="text-muted-foreground mt-1 text-xs break-words">{disputa.comentarioAdmin}</p>
      )}
    </div>
  )
}
