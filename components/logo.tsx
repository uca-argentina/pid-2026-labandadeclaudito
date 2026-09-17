import Image from 'next/image'
import { cn } from '@/lib/utils'

// Dos archivos porque el verde de marca cambia entre modo claro y oscuro:
// el mismo verde oscuro sobre fondo oscuro casi no se ve.
export function Logo({ className }: { className?: string }) {
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
