import type { DecisionDisputa, EstadoDisputa } from '@/lib/generated/prisma/client'
import { decisionDisputaLabels, estadoDisputaLabels } from '@/lib/labels'

type DisputaParaMostrar = {
  estado: EstadoDisputa
  decision: DecisionDisputa | null
  comentarioAdmin: string | null
}

const estilos = {
  ABIERTA: 'bg-accent text-accent-foreground',
  A_FAVOR_JUGADOR: 'bg-green-600/15 text-green-700 dark:text-green-500',
  A_FAVOR_DUENIO: 'bg-destructive/15 text-destructive',
}

// Lo que el jugador ve de su disputa en el historial: en qué está y, si ya se
// resolvió, qué decidió el administrador y por qué.
export function EstadoDeDisputa({ disputa }: { disputa: DisputaParaMostrar }) {
  const estilo = disputa.decision ? estilos[disputa.decision] : estilos.ABIERTA
  const texto = disputa.decision
    ? `${estadoDisputaLabels.RESUELTA}: ${decisionDisputaLabels[disputa.decision]}`
    : estadoDisputaLabels.ABIERTA

  return (
    <div className="ml-auto max-w-56 text-right">
      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${estilo}`}>{texto}</span>
      {disputa.comentarioAdmin && (
        <p className="text-muted-foreground mt-1 text-xs">{disputa.comentarioAdmin}</p>
      )}
    </div>
  )
}
