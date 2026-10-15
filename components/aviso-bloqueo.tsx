import { Lock } from 'lucide-react'

// Línea con candado que acompaña a una cancha o a un complejo bloqueado. La
// card o fila entera va en gris donde la cancha no se puede usar ese día (las
// pantallas del dueño); en las del jugador no, porque le quedan turnos libres.
export function AvisoBloqueo({ texto }: { texto: string }) {
  return (
    <p className="text-foreground flex items-center gap-1.5 text-xs font-medium">
      <Lock className="size-3.5 shrink-0" />
      {texto}
    </p>
  )
}
