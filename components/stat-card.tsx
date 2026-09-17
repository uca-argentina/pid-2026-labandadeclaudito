import type { LucideIcon } from 'lucide-react'

export function StatCard({
  icon: Icon,
  label,
  value,
  detalle,
}: {
  icon: LucideIcon
  label: string
  value: number | string
  detalle: string
}) {
  return (
    <div className="border-border bg-card rounded-2xl border p-6">
      <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4" />
        {label}
      </div>
      <p className="mt-3 text-4xl font-semibold tracking-tight">{value}</p>
      <p className="text-muted-foreground mt-1.5 text-sm">{detalle}</p>
    </div>
  )
}
