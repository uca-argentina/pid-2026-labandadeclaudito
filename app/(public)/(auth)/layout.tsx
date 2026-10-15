import { LoginHero } from '@/components/login-hero/login-hero'
import { Logo } from '@/components/logo'

// Split screen: el panel verde con la animación a la izquierda (solo desktop)
// y el formulario a la derecha, en una "hoja" con las esquinas redondeadas
// apoyada sobre el verde (igual que el contenido de la app sobre el sidebar).
// En celular no hay panel: el logo va arriba del formulario.
export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="bg-sidebar grid min-h-dvh lg:grid-cols-2">
      <LoginHero />
      <div className="bg-background flex flex-col items-center justify-center gap-8 px-6 py-12 lg:rounded-l-3xl">
        <div className="flex items-center gap-2.5 lg:hidden">
          <Logo className="size-9" />
          <span className="font-brand text-2xl font-extrabold tracking-tight">
            Toca<span className="text-primary">Y</span>Juga
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
