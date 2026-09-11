'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Lock, Mail, User, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { registerSchema } from '@/lib/validations/user'

export default function RegistroPage() {
  const [rol, setRol] = useState<'JUGADOR' | 'DUENIO'>('JUGADOR')
  const router = useRouter()
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const form = new FormData(e.currentTarget)

    // TODO (vos): comparar form.get('confirmPassword') con form.get('password') acá.
    // Si no coinciden: setError('Las contraseñas no coinciden') y return.

    const datos = {
      nombre: form.get('nombre'),
      email: form.get('email'),
      password: form.get('password'),
      rol: rol,
    }

    const parsed = registerSchema.safeParse(datos)
    if (!parsed.success) {
      setError('Revisá los datos, algo no es válido')
      return
    }
    setCargando(true)
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })
    if (res.ok) {
      router.push('/login')
      return
    }
    const json = await res.json()
    setError(json.error)
    setCargando(false)
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="bg-primary text-primary-foreground mx-auto mb-1 flex size-10 items-center justify-center rounded-full">
            <User className="size-5" />
          </div>
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>Registrate para reservar o publicar tu complejo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <div className="relative">
                <User className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input id="nombre" name="nombre" placeholder="Juan Pérez" className="pl-8" />
              </div>
            </div>

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
                  placeholder="Mínimo 8 caracteres"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repetí tu contraseña"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Soy</Label>
              <ToggleGroup
                value={[rol]}
                onValueChange={(valores) => {
                  if (valores[0]) setRol(valores[0] as 'JUGADOR' | 'DUENIO')
                }}
                variant="outline"
                className="w-full"
              >
                <ToggleGroupItem value="JUGADOR" className="flex-1">
                  Jugador
                </ToggleGroupItem>
                <ToggleGroupItem value="DUENIO" className="flex-1">
                  Dueño de complejo
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <Button type="submit" className="w-full" disabled={cargando}>
              <UserPlus className="size-4" />
              {cargando ? 'Creando...' : 'Crear cuenta'}
            </Button>
          </form>

          {error && <p className="text-destructive mt-4 text-sm">{error}</p>}

          <p className="text-muted-foreground mt-4 text-center text-sm">
            ¿Ya tenés cuenta?{' '}
            <Link
              href="/login"
              className="text-foreground inline-flex items-center gap-1 underline underline-offset-4"
            >
              Iniciar sesión <ArrowRight className="size-3" />
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
