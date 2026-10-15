import { iniciales } from '@/lib/iniciales'

// El jugador que reservó, a la derecha de una fila de turno del dueño: sus
// iniciales en un círculo y el nombre. El ancho fijo hace que los nombres
// queden alineados entre filas. En celular queda solo el círculo.
export function QuienReservo({ nombre }: { nombre: string }) {
  return (
    <span title={nombre} className="flex shrink-0 items-center gap-2 sm:w-44">
      <span className="bg-primary/15 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
        {iniciales(nombre)}
      </span>
      <span className="hidden truncate text-sm sm:block">{nombre}</span>
    </span>
  )
}
