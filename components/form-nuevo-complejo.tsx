'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Building2, Check, ImageIcon, Plus, Save, Star } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createComplexSchema, type CreateComplexInput } from '@/lib/validations/complex'

function MensajeError({ mensaje }: { mensaje?: string }) {
  if (!mensaje) {
    return null
  }
  return (
    <p className="text-destructive flex items-center gap-1 text-sm font-medium">
      <AlertCircle className="size-3.5" /> {mensaje}
    </p>
  )
}

export function FormNuevoComplejo() {
  const [nombreCreado, setNombreCreado] = useState<string | null>(null)
  const [errorServidor, setErrorServidor] = useState('')

  const { register, handleSubmit, formState } = useForm<CreateComplexInput>({
    resolver: zodResolver(createComplexSchema),
    defaultValues: { nombre: '', direccion: '', zona: '', contacto: '' },
  })
  const errores = formState.errors
  const hayErrores = Object.keys(errores).length > 0

  async function onSubmit(datos: CreateComplexInput) {
    setErrorServidor('')

    const res = await fetch('/api/complexes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    const json = await res.json()
    if (!res.ok) {
      setErrorServidor(json.error)
      return
    }

    setNombreCreado(datos.nombre)
  }

  if (nombreCreado) {
    return (
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-full">
            <Check className="size-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Complejo creado</h2>
            <p className="text-muted-foreground max-w-md text-sm">
              “{nombreCreado}” ya está en tu cuenta. Para que aparezca en la búsqueda, cargá al
              menos una cancha.
            </p>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/dueno/complejos"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Ver mis complejos
            </Link>
            <Button size="lg" disabled>
              <Plus /> Cargar primera cancha
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {hayErrores && (
        <div className="border-destructive/40 bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium">
          <AlertCircle className="size-4 shrink-0" />
          Revisá los campos marcados para poder guardar.
        </div>
      )}

      {errorServidor && (
        <div className="border-destructive/40 bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium">
          <AlertCircle className="size-4 shrink-0" />
          {errorServidor}
        </div>
      )}

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 font-semibold">
            <Building2 className="size-4" /> Datos del complejo
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="nombre">Nombre del complejo *</Label>
            <Input
              id="nombre"
              placeholder="Ej: El Ombú Fútbol & Pádel"
              aria-invalid={errores.nombre ? true : undefined}
              {...register('nombre')}
            />
            <p className="text-muted-foreground text-sm">
              Es el nombre que van a ver los jugadores al buscar.
            </p>
            <MensajeError mensaje={errores.nombre?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección *</Label>
            <Input
              id="direccion"
              placeholder="Ej: Av. San Martín 4520"
              aria-invalid={errores.direccion ? true : undefined}
              {...register('direccion')}
            />
            <p className="text-muted-foreground text-sm">Calle y número.</p>
            <MensajeError mensaje={errores.direccion?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zona">Zona *</Label>
            <Input
              id="zona"
              placeholder="Ej: Villa Devoto, CABA"
              aria-invalid={errores.zona ? true : undefined}
              {...register('zona')}
            />
            <p className="text-muted-foreground text-sm">Barrio o localidad.</p>
            <MensajeError mensaje={errores.zona?.message} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="contacto">Teléfono de contacto *</Label>
            <Input
              id="contacto"
              type="tel"
              placeholder="Ej: 11 4589-2231"
              aria-invalid={errores.contacto ? true : undefined}
              {...register('contacto')}
            />
            <p className="text-muted-foreground text-sm">
              Lo usamos para que los jugadores te contacten por una reserva.
            </p>
            <MensajeError mensaje={errores.contacto?.message} />
          </div>
        </CardContent>
      </Card>

      {/* Solo visual: la subida de fotos llega con UCA-16 (Vercel Blob). */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 font-semibold">
            <ImageIcon className="size-4" /> Fotos
            <span className="text-muted-foreground text-sm font-medium">· opcional</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="bg-muted text-muted-foreground flex aspect-4/3 flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-2 text-center font-mono text-xs">
              <span className="font-semibold">foto de portada</span>
              <span>arrastrá una imagen</span>
            </div>
            <div className="text-muted-foreground flex aspect-4/3 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-sm font-medium">
              <Plus className="size-4" />
              Agregar foto
            </div>
          </div>
          <div className="bg-muted flex items-center gap-2 rounded-lg border px-4 py-3 text-sm">
            <Star className="text-primary size-4 shrink-0" />
            La foto de portada es la que aparece en los resultados de búsqueda.
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Link
          href="/dueno/complejos"
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          Cancelar
        </Link>
        <Button type="submit" size="lg" disabled={formState.isSubmitting}>
          <Save /> {formState.isSubmitting ? 'Creando...' : 'Crear complejo'}
        </Button>
      </div>
    </form>
  )
}
