'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, CalendarDays, Home, Search } from 'lucide-react'
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
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SignOutButton } from '@/components/sign-out-button'
import { Logo } from '@/components/logo'

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
  ],
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
  const items = navPorRol[rol]
  const home = rol === 'DUENIO' ? '/dueno' : '/jugador'

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center px-2 py-0">
        {/* Sidebar abierto: logo + nombre, y el botón de plegar a la derecha. */}
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:hidden">
          <Link href={home} className="flex min-w-0 flex-1 items-center gap-2.5">
            <Logo className="size-8" />
            <span className="truncate font-semibold">TocaYJuga</span>
          </Link>
          <SidebarTrigger />
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
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                    tooltip={item.label}
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
        <div className="group-data-[collapsible=icon]:hidden">
          <SignOutButton className="w-full" />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
