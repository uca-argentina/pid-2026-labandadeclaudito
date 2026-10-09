'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSession, signIn } from 'next-auth/react'
import { Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { homePorRol } from '@/lib/home-por-rol'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cuentaCreada = searchParams.get('registrado') === '1'

  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setCargando(true)

    const form = new FormData(e.currentTarget)
    const resultado = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    })

    if (resultado?.code === 'demasiados_intentos') {
      setError('Demasiados intentos fallidos. Esperá 15 minutos y probá de nuevo.')
      setCargando(false)
      return
    }
    if (resultado?.code === 'cuenta_suspendida') {
      setError('Tu cuenta está suspendida. Si creés que es un error, contactá a TocaYJuga.')
      setCargando(false)
      return
    }
    if (resultado?.error) {
      setError('Email o contraseña incorrectos')
      setCargando(false)
      return
    }

    const session = await getSession()
    router.push(session ? homePorRol(session.user.rol) : '/login')
    router.refresh()
  }

  return (
    <div className="bg-card shadow-card w-full max-w-100 rounded-3xl p-6 sm:p-8">
      <h1 className="font-heading text-4xl font-bold tracking-tight">¡Hola de nuevo!</h1>
      <p className="text-muted-foreground mt-2 text-base">Ingresá a tu cuenta de TocaYJuga.</p>

      {cuentaCreada && (
        <p className="bg-primary/10 text-primary mt-5 rounded-xl px-3.5 py-2.5 text-sm font-medium">
          ¡Listo, ya tenés tu cuenta! Iniciá sesión para empezar.
        </p>
      )}

      {/* method="post": si se envía antes de que la página termine de cargar
          el JavaScript, el navegador lo manda solo. Con el GET por defecto la
          contraseña quedaba en la URL (y en el historial). */}
      <form method="post" className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="text-muted-foreground absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="juan@mail.com"
              className="pl-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Lock className="text-muted-foreground absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="pl-11"
            />
          </div>
        </div>

        {error && (
          <p className="bg-destructive/10 text-destructive rounded-xl px-3.5 py-2.5 text-sm font-medium">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
        </Button>
      </form>

      <p className="text-muted-foreground mt-5 text-center text-sm">
        ¿Aún no tenés cuenta?{' '}
        <Link href="/register" className="text-primary font-semibold underline underline-offset-4">
          Registrate
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
