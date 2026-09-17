'use client'

import { useState, type ChangeEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AlertCircle, ImageIcon, Loader2, Plus } from 'lucide-react'
import { DeleteComplexImageDialog } from '@/components/delete-complex-image-dialog'
import { complexImageSchema, MAX_IMAGES_PER_COMPLEX } from '@/lib/validations/complex'
import type { ImagenComplejo } from '@/lib/generated/prisma/client'

export function ComplexPhotosEditor({
  complejoId,
  imagenes,
}: {
  complejoId: string
  imagenes: ImagenComplejo[]
}) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [subiendo, setSubiendo] = useState(false)

  async function subirFotos(event: ChangeEvent<HTMLInputElement>) {
    const archivosElegidos = event.target.files
    if (!archivosElegidos) {
      return
    }
    setError('')
    setSubiendo(true)

    let lugaresLibres = MAX_IMAGES_PER_COMPLEX - imagenes.length
    for (const archivo of Array.from(archivosElegidos)) {
      if (lugaresLibres === 0) {
        setError(`Podés tener hasta ${MAX_IMAGES_PER_COMPLEX} fotos.`)
        break
      }
      const parsed = complexImageSchema.safeParse({ imagen: archivo })
      if (!parsed.success) {
        setError(`${archivo.name}: ${parsed.error.issues[0].message}`)
        continue
      }

      // Una foto por request: Vercel no acepta bodies de más de 4.5 MB
      const formData = new FormData()
      formData.append('imagen', archivo)
      const res = await fetch(`/api/complexes/${complejoId}/images`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const json = await res.json()
        setError(`${archivo.name}: ${json.error}`)
        continue
      }
      lugaresLibres--
    }

    // Vaciar el input para que se pueda volver a elegir el mismo archivo
    event.target.value = ''
    setSubiendo(false)
    router.refresh()
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <ImageIcon className="size-5" /> Fotos
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Hasta {MAX_IMAGES_PER_COMPLEX} fotos · JPG, PNG o WebP de 4 MB como máximo. La primera es
          la portada.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {imagenes.map((imagen, indice) => (
          <div key={imagen.id} className="relative aspect-4/3 overflow-hidden rounded-lg border">
            <Image
              src={imagen.url}
              alt={`Foto ${indice + 1} del complejo`}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover"
            />
            {indice === 0 && (
              <span className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium">
                Portada
              </span>
            )}
            <div className="absolute top-2 right-2">
              <DeleteComplexImageDialog
                complejoId={complejoId}
                imageId={imagen.id}
                onDeleted={() => router.refresh()}
              />
            </div>
          </div>
        ))}

        {imagenes.length < MAX_IMAGES_PER_COMPLEX && (
          <label
            htmlFor="fotos-nuevas"
            className="text-muted-foreground hover:bg-accent flex aspect-4/3 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-sm font-medium"
          >
            {subiendo ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            {subiendo ? 'Subiendo fotos...' : 'Agregar foto'}
          </label>
        )}
        <input
          id="fotos-nuevas"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={subiendo}
          className="hidden"
          onChange={subirFotos}
        />
      </div>

      {error && (
        <p className="text-destructive flex items-center gap-1 text-xs font-medium">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      )}
    </section>
  )
}
