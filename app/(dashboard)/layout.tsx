import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

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
          <div className="flex h-14 shrink-0 items-center border-b px-4">
            <SidebarTrigger />
          </div>
          <div className="flex-1">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
