'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSession, signIn } from 'next-auth/react'
import { ArrowRight, Lock, LogIn, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/logo'

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

    if (resultado?.error) {
      setError('Email o contraseña incorrectos')
      setCargando(false)
      return
    }

    const session = await getSession()
    router.push(session?.user.rol === 'DUENIO' ? '/dueno' : '/jugador')
    router.refresh()
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <Logo className="mx-auto mb-1 size-12" />
          <CardTitle className="text-2xl">Bienvenido</CardTitle>
          <CardDescription>Ingresá a tu cuenta de TocaYJuga.</CardDescription>
        </CardHeader>
        <CardContent>
          {cuentaCreada && (
            <p className="bg-primary/10 text-primary mb-4 rounded-lg px-3 py-2 text-sm">
              Cuenta creada. Iniciá sesión para continuar.
            </p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="juan@mail.com"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-8"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={cargando}>
              <LogIn className="size-4" />
              {cargando ? 'Ingresando...' : 'Iniciar sesión'}
            </Button>
          </form>

          {error && <p className="text-destructive mt-4 text-sm">{error}</p>}

          <p className="text-muted-foreground mt-4 text-center text-sm">
            ¿Aún no tenés cuenta?{' '}
            <Link
              href="/register"
              className="text-foreground inline-flex items-center gap-1 underline underline-offset-4"
            >
              Registrarse <ArrowRight className="size-3" />
            </Link>
          </p>
        </CardContent>
      </Card>
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
