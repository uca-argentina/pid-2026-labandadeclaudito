import { ThemeToggle } from '@/components/theme-toggle'

export default function PublicLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <div className="bg-card shadow-soft absolute top-4 right-4 z-10 overflow-hidden rounded-full">
        <ThemeToggle />
      </div>
      <main className="flex-1">{children}</main>
    </>
  )
}
