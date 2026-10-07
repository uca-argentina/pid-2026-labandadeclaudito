import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import { deporteLabels } from '@/lib/labels'
import type { Deporte } from '@/lib/generated/prisma/client'
import { SportIcon } from '@/components/sport-icon'

export type PestanaDeDeporte = {
  // undefined = todos los deportes
  deporte: Deporte | undefined
  href: string
  activa: boolean
}

const clasePestana =
  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors'

// Pestañas de deporte arriba del bloque principal: el deporte elegido cambia
// los colores y la cancha del bloque, por eso se eligen ahí mismo.
// Si no entran en una fila bajan a la siguiente (sin scroll de costado, que en
// el celular deja una barra fea).
export function SportTabs({ pestanas }: { pestanas: PestanaDeDeporte[] }) {
  return (
    <nav className="flex flex-wrap gap-1.5" aria-label="Deporte">
      {pestanas.map((pestana) => (
        <Link
          key={pestana.deporte ?? 'todos'}
          href={pestana.href}
          scroll={false}
          aria-current={pestana.activa ? 'page' : undefined}
          className={
            pestana.activa
              ? `${clasePestana} bg-hero-line text-tema-hasta shadow-sm`
              : `${clasePestana} bg-hero-line/10 text-hero-line hover:bg-hero-line/20`
          }
        >
          {pestana.deporte ? (
            <SportIcon deporte={pestana.deporte} className="size-5" />
          ) : (
            <LayoutGrid className="size-4" />
          )}
          {pestana.deporte && deporteLabels[pestana.deporte]}
          {/* En el celular, corto */}
          {!pestana.deporte && <span className="sm:hidden">Todos</span>}
          {!pestana.deporte && <span className="hidden sm:inline">Todos los deportes</span>}
        </Link>
      ))}
    </nav>
  )
}
