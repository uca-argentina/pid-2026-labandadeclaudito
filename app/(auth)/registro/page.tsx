import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// MOCKUP visual — sin validación ni fetch todavía, eso se agrega en Paso 2.
// Sirve de plantilla para login y para cualquier otra pantalla de form.
export default function RegistroPage() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>Registrate para reservar o publicar tu complejo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" placeholder="Juan Pérez" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="juan@mail.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" />
            </div>

            <div className="space-y-2">
              <Label>Soy</Label>
              <RadioGroup defaultValue="JUGADOR" className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="JUGADOR" id="rol-jugador" />
                  <Label htmlFor="rol-jugador" className="font-normal">
                    Jugador
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="DUENIO" id="rol-duenio" />
                  <Label htmlFor="rol-duenio" className="font-normal">
                    Dueño de complejo
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full">
              Crear cuenta
            </Button>
          </form>

          <p className="text-muted-foreground mt-4 text-center text-sm">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-foreground underline underline-offset-4">
              Iniciar sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
