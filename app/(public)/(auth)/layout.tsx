import { LoginHero } from '@/components/login-hero/login-hero'

// Split screen: ilustración a la izquierda (solo desktop) y el formulario a la
// derecha. El borde del hero hace de divisoria.
export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <LoginHero />
      <div className="flex items-center justify-center px-6 py-12">{children}</div>
    </div>
  )
}
