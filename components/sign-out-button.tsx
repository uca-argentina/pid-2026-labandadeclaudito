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
        // Más oscuro que la tarjeta del perfil (que es un blanco al 10% sobre
        // el verde): el bg-sidebar es el verde de fondo, y el hover lo oscurece.
        'text-sidebar-foreground/90 border-sidebar-border bg-sidebar hover:bg-black/25 w-full rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
        className,
      )}
      onClick={() => signOut({ callbackUrl: '/login' })}
    >
      Cerrar sesión
    </button>
  )
}
