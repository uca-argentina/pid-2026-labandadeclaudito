import Link from 'next/link'
import { ChevronRight, CircleCheck, Scale } from 'lucide-react'

// La protagonista del panel del admin: lo que espera una decisión suya. Una
// banda a todo el ancho con el total a la izquierda y una fila por cola a la
// derecha. Por ahora solo disputas; los complejos por aprobar se suman con
// SCRUM-57 (otra fila igual y su número en el total).
export function ParaResolver({
  disputasAbiertas,
  antiguedadDeLaDisputa,
}: {
  disputasAbiertas: number
  // "hoy", "ayer", "hace 4 días": cuánto espera la disputa más vieja
  antiguedadDeLaDisputa: string
}) {
  const total = disputasAbiertas

  if (total === 0) {
    return (
      <section className="fondo-cancha tema-todos text-acento-foreground shadow-card flex items-center gap-5 rounded-3xl p-7 sm:p-8">
        <CircleCheck className="size-11 shrink-0" />
        <div>
          <p className="font-heading text-3xl font-bold tracking-tight">Está todo al día</p>
          <p className="text-acento-foreground/90 mt-1">
            No hay disputas esperando una decisión. Cuando un jugador abra una, va a aparecer acá.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-card shadow-card grid grid-cols-1 gap-5 rounded-3xl p-7 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8">
      <div>
        <p className="text-muted-foreground text-sm font-semibold">Para resolver</p>
        <div className="mt-1.5 flex items-baseline gap-3">
          <span className="font-heading text-primary text-7xl font-extrabold tracking-tighter">
            {total}
          </span>
          <span className="leading-snug font-semibold">
            {total === 1 ? 'pendiente' : 'pendientes'}
          </span>
        </div>
      </div>

      <div className="border-border flex flex-col justify-center border-t pt-3 md:border-t-0 md:border-l md:pt-0 md:pl-8">
        <Link
          href="/admin/disputas"
          className="hover:bg-muted -mx-3 flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors"
        >
          <span className="bg-clay/12 text-clay-foreground flex size-11 shrink-0 items-center justify-center rounded-xl">
            <Scale className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Disputas abiertas</span>
            <span className="text-muted-foreground block text-sm">
              La más vieja, {antiguedadDeLaDisputa}
            </span>
          </span>
          <span className="font-heading text-2xl font-bold tabular-nums">{disputasAbiertas}</span>
          <ChevronRight className="text-muted-foreground size-5 shrink-0" />
        </Link>
      </div>
    </section>
  )
}
