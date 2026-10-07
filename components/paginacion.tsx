import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Pie de una lista paginada: "21–40 de 95", Anterior, "2 / 5" y Siguiente.
// Los links los arma cada página, porque cada una conserva sus propios
// filtros en la URL.
export function Paginacion({
  paginaActual,
  totalPaginas,
  desde,
  hasta,
  total,
  urlAnterior,
  urlSiguiente,
}: {
  paginaActual: number
  totalPaginas: number
  desde: number
  hasta: number
  total: number
  urlAnterior: string
  urlSiguiente: string
}) {
  return (
    <div className="border-border flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm">
      <p className="text-muted-foreground whitespace-nowrap">
        {desde}–{hasta} de {total}
      </p>
      <div className="flex items-center gap-2">
        <BotonDePagina href={paginaActual > 1 ? urlAnterior : null}>
          <ChevronLeft className="size-4" />
          Anterior
        </BotonDePagina>
        <span className="text-muted-foreground whitespace-nowrap">
          {paginaActual} / {totalPaginas}
        </span>
        <BotonDePagina href={paginaActual < totalPaginas ? urlSiguiente : null}>
          Siguiente
          <ChevronRight className="size-4" />
        </BotonDePagina>
      </div>
    </div>
  )
}

// Sin href (primera o última página) se muestra apagado y no se puede tocar
function BotonDePagina({ href, children }: { href: string | null; children: React.ReactNode }) {
  if (href === null) {
    return (
      <span className="border-border text-muted-foreground inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 opacity-50">
        {children}
      </span>
    )
  }
  return (
    <Link
      href={href}
      className="border-border hover:bg-muted inline-flex items-center gap-1 rounded-lg border px-2.5 py-1"
    >
      {children}
    </Link>
  )
}
