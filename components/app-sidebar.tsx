'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, CalendarDays, ChartColumn, Equal, Home, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SignOutButton } from '@/components/sign-out-button'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

type ItemNav = {
  href: string
  label: string
  icon: typeof Home
}

const navPorRol: Record<'JUGADOR' | 'DUENIO', ItemNav[]> = {
  JUGADOR: [
    { href: '/jugador', label: 'Inicio', icon: Home },
    { href: '/jugador/canchas', label: 'Buscar canchas', icon: Search },
    { href: '/jugador/reservas', label: 'Mis reservas', icon: CalendarDays },
  ],
  DUENIO: [
    { href: '/dueno', label: 'Inicio', icon: Home },
    { href: '/dueno/complejos', label: 'Mis complejos', icon: Building2 },
    { href: '/dueno/reservas', label: 'Reservas', icon: CalendarDays },
    { href: '/dueno/dashboard', label: 'Estadísticas', icon: ChartColumn },
  ],
}

// Botón de la barra de arriba en mobile para abrir el sidebar (dos líneas)
export function MobileMenuButton() {
  const { setOpenMobile } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Abrir menú"
      onClick={() => setOpenMobile(true)}
    >
      <Equal className="size-5" />
    </Button>
  )
}

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .map((palabra) => palabra[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function AppSidebar({
  rol,
  nombre,
  email,
}: {
  rol: 'JUGADOR' | 'DUENIO'
  nombre: string
  email: string
}) {
  const pathname = usePathname()
  // En mobile el sidebar es un panel encima de la página: lo cerramos al navegar
  const { isMobile, setOpenMobile } = useSidebar()
  const items = navPorRol[rol]
  const home = rol === 'DUENIO' ? '/dueno' : '/jugador'

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center px-2 py-0">
        {/* Sidebar abierto: logo y nombre a la izquierda, y a la derecha el botón
            de plegar (desktop) o una cruz para cerrar (mobile).
            pl-2 alinea el logo con los íconos del nav: el contenido de abajo
            suma el p-2 del SidebarContent, del SidebarGroup y del botón. */}
        <div className="flex items-center justify-between pl-2 group-data-[collapsible=icon]:hidden">
          <Link
            href={home}
            className="flex items-center gap-2"
            onClick={() => setOpenMobile(false)}
          >
            <Logo className="size-8" />
            <span className="font-brand text-xl font-extrabold tracking-tight">
              Toca<span className="text-primary">Y</span>Juga
            </span>
          </Link>
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Cerrar menú"
              onClick={() => setOpenMobile(false)}
            >
              <X />
            </Button>
          ) : (
            <SidebarTrigger />
          )}
        </div>

        {/* Sidebar plegado: se ve el logo, y al pasar el mouse por encima
            aparece en su lugar el botón para volver a abrirlo. */}
        <div className="group/logo relative mx-auto hidden size-8 group-data-[collapsible=icon]:block">
          <Link
            href={home}
            className="flex size-8 items-center justify-center transition-opacity group-hover/logo:opacity-0"
          >
            <Logo className="size-8" />
          </Link>
          <SidebarTrigger className="absolute inset-0 size-8 opacity-0 transition-opacity group-hover/logo:opacity-100" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} onClick={() => setOpenMobile(false)} />}
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="h-10 text-base [&_svg]:size-5 group-data-[collapsible=icon]:p-1.5!"
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2">
        <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center">
          <Avatar className="size-7 shrink-0">
            <AvatarFallback>{iniciales(nombre)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium">{nombre}</p>
            <p className="text-muted-foreground truncate text-xs">{email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <SignOutButton className="flex-1 group-data-[collapsible=icon]:hidden" />
          <ThemeToggle />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
