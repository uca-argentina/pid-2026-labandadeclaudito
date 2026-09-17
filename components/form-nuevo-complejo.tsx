'use client'

import { useState, type ChangeEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Building2, Check, ImageIcon, Plus, Save, Star, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  complexImageSchema,
  createComplexSchema,
  MAX_IMAGES_PER_COMPLEX,
  type CreateComplexInput,
} from '@/lib/validations/complex'

type FotoElegida = {
  archivo: File
  preview: string
}

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
  const [idCreado, setIdCreado] = useState('')
  const [errorServidor, setErrorServidor] = useState('')
  const [fotos, setFotos] = useState<FotoElegida[]>([])
  const [errorFotos, setErrorFotos] = useState('')
  const [subiendoFotos, setSubiendoFotos] = useState(false)
  const [fotosFallidas, setFotosFallidas] = useState(0)

  const { register, handleSubmit, formState } = useForm<CreateComplexInput>({
    resolver: zodResolver(createComplexSchema),
    defaultValues: { nombre: '', direccion: '', zona: '', contacto: '' },
  })
  const errores = formState.errors
  const hayErrores = Object.keys(errores).length > 0

  function agregarFotos(event: ChangeEvent<HTMLInputElement>) {
    const archivosElegidos = event.target.files
    if (!archivosElegidos) {
      return
    }
    setErrorFotos('')

    const fotosNuevas = [...fotos]
    for (const archivo of Array.from(archivosElegidos)) {
      if (fotosNuevas.length >= MAX_IMAGES_PER_COMPLEX) {
        setErrorFotos(`Podés subir hasta ${MAX_IMAGES_PER_COMPLEX} fotos.`)
        break
      }
      const parsed = complexImageSchema.safeParse({ imagen: archivo })
      if (!parsed.success) {
        setErrorFotos(`${archivo.name}: ${parsed.error.issues[0].message}`)
        continue
      }
      fotosNuevas.push({ archivo, preview: URL.createObjectURL(archivo) })
    }
    setFotos(fotosNuevas)

    // Vaciar el input para que se pueda volver a elegir el mismo archivo
    event.target.value = ''
  }

  function quitarFoto(indice: number) {
    URL.revokeObjectURL(fotos[indice].preview)
    setFotos(fotos.filter((_, i) => i !== indice))
  }

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

    // Una foto por request: Vercel no acepta bodies de más de 4.5 MB
    setSubiendoFotos(true)
    let cantidadFallidas = 0
    for (const foto of fotos) {
      const formData = new FormData()
      formData.append('imagen', foto.archivo)
      const resFoto = await fetch(`/api/complexes/${json.id}/images`, {
        method: 'POST',
        body: formData,
      })
      if (!resFoto.ok) {
        cantidadFallidas++
      }
    }
    setSubiendoFotos(false)
    setFotosFallidas(cantidadFallidas)

    setIdCreado(json.id)
    setNombreCreado(datos.nombre)
  }

  let textoBotonGuardar = 'Crear complejo'
  if (subiendoFotos) {
    textoBotonGuardar = 'Subiendo fotos...'
  } else if (formState.isSubmitting) {
    textoBotonGuardar = 'Creando...'
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
            {fotosFallidas > 0 && (
              <p className="text-destructive text-sm font-medium">
                {fotosFallidas === 1
                  ? '1 foto no se pudo subir.'
                  : `${fotosFallidas} fotos no se pudieron subir.`}
              </p>
            )}
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/dueno/complejos"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Ver mis complejos
            </Link>
            <Link
              href={`/dueno/complejos/${idCreado}/canchas/nueva`}
              className={buttonVariants({ size: 'lg' })}
            >
              <Plus /> Cargar primera cancha
            </Link>
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

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 font-semibold">
            <ImageIcon className="size-4" /> Fotos
            <span className="text-muted-foreground text-sm font-medium">· opcional</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {fotos.map((foto, indice) => (
              <div
                key={foto.preview}
                className="relative aspect-4/3 overflow-hidden rounded-lg border"
              >
                {/* unoptimized: el preview es una URL blob: local del navegador */}
                <Image
                  src={foto.preview}
                  alt={foto.archivo.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                {indice === 0 && (
                  <span className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium">
                    Portada
                  </span>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-xs"
                  className="absolute top-2 right-2"
                  aria-label={`Quitar ${foto.archivo.name}`}
                  onClick={() => quitarFoto(indice)}
                >
                  <X />
                </Button>
              </div>
            ))}

            {fotos.length < MAX_IMAGES_PER_COMPLEX && (
              <label
                htmlFor="fotos"
                className="text-muted-foreground hover:bg-accent flex aspect-4/3 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-sm font-medium"
              >
                <Plus className="size-4" />
                Agregar foto
              </label>
            )}
            <input
              id="fotos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={agregarFotos}
            />
          </div>
          <p className="text-muted-foreground text-sm">
            Hasta {MAX_IMAGES_PER_COMPLEX} fotos, JPG, PNG o WebP de 4 MB como máximo.
          </p>
          <MensajeError mensaje={errorFotos} />
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
          <Save /> {textoBotonGuardar}
        </Button>
      </div>
    </form>
  )
}
