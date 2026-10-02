import { ChevronDown } from 'lucide-react'

export function CollapsibleSection({
  title,
  //  count,
  children,
}: {
  title: string
  //  count: number
  children: React.ReactNode
}) {
  return (
    <details className="group space-y-4">
      <summary className="text-muted-foreground hover:text-foreground flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
        {title} {/* ({count}) */}
      </summary>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{children}</div>
    </details>
  )
}
