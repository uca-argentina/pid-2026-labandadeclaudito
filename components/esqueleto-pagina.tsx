import { Skeleton } from '@/components/ui/skeleton'

// Esqueleto de una página del dashboard mientras el server la arma: título,
// una fila de tarjetas y una lista, que es la forma de casi todas las páginas.
// Lo usan los loading.tsx de cada sección (jugador, dueno, admin...). Next
// muestra el loading.tsx del segmento de la URL que cambia, por eso hay uno
// por sección y no uno solo arriba de todo: ese no se vería nunca.
export function EsqueletoPagina() {
  return (
    <div aria-busy="true" aria-label="Cargando">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      <Skeleton className="mt-10 h-6 w-44" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
