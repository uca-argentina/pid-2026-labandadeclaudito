import { ThemeToggle } from '@/components/theme-toggle'

export default function PublicLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <main className="flex-1">{children}</main>
    </>
  )
}
