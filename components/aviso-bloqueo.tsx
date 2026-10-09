import { Lock } from 'lucide-react'

// Línea con candado que acompaña a una cancha o a un complejo bloqueado. La
// card o fila entera va en gris (clases "opacity-60 grayscale" donde se usa).
export function AvisoBloqueo({ texto }: { texto: string }) {
  return (
    <p className="text-foreground flex items-center gap-1.5 text-xs font-medium">
      <Lock className="size-3.5 shrink-0" />
      {texto}
    </p>
  )
}
