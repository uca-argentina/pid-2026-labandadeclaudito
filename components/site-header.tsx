import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  return (
    <header className="bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          TocaYJuga
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/complejos/nuevo"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Crear complejo
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
