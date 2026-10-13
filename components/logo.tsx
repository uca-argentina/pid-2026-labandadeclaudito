import Image from 'next/image'
import { cn } from '@/lib/utils'

// Dos archivos porque el verde de marca cambia entre modo claro y oscuro:
// el mismo verde oscuro sobre fondo oscuro casi no se ve.
// sobreFondoOscuro: para fondos que son oscuros en los dos temas (el sidebar),
// donde va siempre el logo claro.
export function Logo({
  className,
  sobreFondoOscuro = false,
}: {
  className?: string
  sobreFondoOscuro?: boolean
}) {
  if (sobreFondoOscuro) {
    return (
      <span className={cn('relative block shrink-0', className)}>
        <Image src="/logo-dark.png" alt="" fill sizes="64px" className="object-contain" />
      </span>
    )
  }

  return (
    <span className={cn('relative block shrink-0', className)}>
      <Image src="/logo.png" alt="" fill sizes="64px" className="object-contain dark:hidden" />
      <Image
        src="/logo-dark.png"
        alt=""
        fill
        sizes="64px"
        className="hidden object-contain dark:block"
      />
    </span>
  )
}
