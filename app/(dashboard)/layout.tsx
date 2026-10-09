import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AppSidebar, MobileMenuButton } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
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
          {/* En mobile el sidebar se esconde: esta barra tiene el botón para abrirlo */}
          <header className="border-border flex h-14 items-center border-b px-4 md:hidden">
            <MobileMenuButton />
          </header>
          {/* Ancho y márgenes de todas las páginas del dashboard: ocupan todo
              el ancho hasta 1536px y, en pantallas más grandes, se centran.
              Las páginas no ponen su propio max-w ni padding. */}
          <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-6 pt-6 pb-12 md:pt-4 lg:px-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
