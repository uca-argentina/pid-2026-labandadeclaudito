'use client'

import { signOut } from 'next-auth/react'
import { cn } from 'cn'

// Link de texto para cerrar sesión. Vive en la tarjeta del perfil del sidebar,
// por eso usa los colores del sidebar (fondo oscuro en los dos temas).
export function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={cn(
        'text-sidebar-foreground/80 hover:text-sidebar-foreground py-0.5 text-xs underline underline-offset-4',
        className,
      )}
      onClick={() => signOut({ callbackUrl: '/login' })}
    >
      Cerrar sesión
    </button>
  )
}
