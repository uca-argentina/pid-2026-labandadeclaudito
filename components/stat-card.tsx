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
    <div className="bg-card shadow-card rounded-2xl p-6">
      <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4" />
        {label}
      </div>
      <p className="font-heading mt-3 text-4xl font-bold tracking-tight">{value}</p>
      <p className="text-muted-foreground mt-1.5 text-sm">{detalle}</p>
    </div>
  )
}
