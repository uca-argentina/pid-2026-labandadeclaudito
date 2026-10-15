import type { LucideIcon } from 'lucide-react'

// Encabezado de columna de una tabla, con su ícono adelante
export function TituloConIcono({
  icono: Icono,
  children,
}: {
  icono: LucideIcon
  children: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icono className="size-3.5" />
      {children}
    </span>
  )
}
