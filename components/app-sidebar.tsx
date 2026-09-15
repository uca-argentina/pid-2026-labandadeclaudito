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
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SignOutButton } from '@/components/sign-out-button'

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
      <SidebarHeader>
        <Link href={home} className="flex items-center gap-2 px-2 py-1.5">
          <div className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-lg text-sm font-semibold">
            T
          </div>
          <span className="font-semibold group-data-[collapsible=icon]:hidden">TocaYJuga</span>
        </Link>
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
