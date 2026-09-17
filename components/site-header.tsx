import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'

export function SiteHeader() {
  return (
    <header className="bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold">
          <Logo className="size-8" />
          TocaYJuga
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
