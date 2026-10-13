import Link from 'next/link'
import { BellRing, ChevronRight, CircleCheck, Scale } from 'lucide-react'

// La protagonista del panel del admin: lo que espera una decisión suya. Si
// hay algo pendiente va en rojo y con la campana sacudiéndose, para que no se
// pase por alto. Por ahora solo disputas; los complejos por aprobar se suman
// con SCRUM-57 (otra fila igual y su número en el total).
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
      <div className="flex items-center gap-5">
        {/* origin-top: la campana se sacude colgada de arriba, como una de verdad */}
        <span className="bg-destructive flex size-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-md">
          <BellRing className="size-8 origin-top motion-safe:animate-campana" />
        </span>
        <div>
          <p className="text-destructive text-sm font-semibold">Para resolver</p>
          <p className="flex items-baseline gap-2.5">
            <span className="font-heading text-destructive text-6xl font-extrabold tracking-tighter">
              {total}
            </span>
            <span className="leading-snug font-semibold">
              {total === 1 ? 'pendiente' : 'pendientes'}
            </span>
          </p>
        </div>
      </div>

      <div className="border-border flex flex-col justify-center border-t pt-3 md:border-t-0 md:border-l md:pt-0 md:pl-8">
        <Link
          href="/admin/disputas"
          className="hover:bg-destructive/5 -mx-3 flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors"
        >
          <span className="bg-destructive/10 text-destructive flex size-11 shrink-0 items-center justify-center rounded-xl">
            <Scale className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Disputas abiertas</span>
            <span className="text-muted-foreground block text-sm">
              La más vieja, {antiguedadDeLaDisputa}
            </span>
          </span>
          <span className="bg-destructive inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 font-bold text-white tabular-nums">
            {disputasAbiertas}
          </span>
          <ChevronRight className="text-muted-foreground size-5 shrink-0" />
        </Link>
      </div>
    </section>
  )
}
