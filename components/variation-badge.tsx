import { Minus, TrendingDown, TrendingUp } from 'lucide-react'

// Cuánto cambió una métrica contra el período anterior (▲ +11%).
// Si subir es bueno o malo depende de la métrica: más ingresos es bueno, más
// cancelaciones es malo. Por eso cada uso dice subirEsBueno.
export function VariationBadge({
  variacion,
  subirEsBueno,
}: {
  variacion: number | null
  subirEsBueno: boolean
}) {
  if (variacion === null) return null

  const subio = variacion > 0
  let Icono = Minus
  if (variacion > 0) Icono = TrendingUp
  if (variacion < 0) Icono = TrendingDown

  let colores = 'bg-muted text-muted-foreground'
  if (variacion !== 0) {
    colores =
      subio === subirEsBueno ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
  }

  return (
    <span
      title="Comparado con el período anterior del mismo largo"
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold ${colores}`}
    >
      <Icono className="size-4" />
      {subio ? '+' : ''}
      {variacion}%
    </span>
  )
}
