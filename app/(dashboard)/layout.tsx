import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function DashboardLayout({ children }: LayoutProps<'/'>) {
  const session = await auth()

  // el proxy ya protege /jugador y /dueno, pero si por algo llega acá
  // sin sesión no queremos romper leyendo session.user de undefined
  if (!session) redirect('/login')

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar
          rol={session.user.rol}
          nombre={session.user.name ?? ''}
          email={session.user.email ?? ''}
        />
        <SidebarInset>
          {/* El botón de plegar vive adentro del sidebar, acá solo queda el tema. */}
          <div className="flex h-16 shrink-0 items-center justify-end border-b px-6">
            <ThemeToggle />
          </div>
          <div className="flex-1">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
