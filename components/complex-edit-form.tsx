'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createComplexSchema } from '@/lib/validations/complex'

type ComplejoAEditar = {
  id: string
  nombre: string
  direccion: string
  zona: string
  contacto: string
  porcentajeSenaDefault: number
}

const claseInputConError = 'border-destructive ring-destructive/20 ring-3'

function ErrorDeCampo({ mensaje }: { mensaje?: string }) {
  if (!mensaje) {
    return null
  }
  return (
    <p className="text-destructive flex items-center gap-1 text-xs font-medium">
      <AlertCircle className="size-3.5" />
      {mensaje}
    </p>
  )
}

export function ComplexEditForm({ complejo }: { complejo: ComplejoAEditar }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const form = new FormData(e.currentTarget)
    const datos = {
      nombre: form.get('nombre'),
      direccion: form.get('direccion'),
      zona: form.get('zona'),
      contacto: form.get('contacto'),
      porcentajeSenaDefault: Number(form.get('porcentajeSenaDefault')),
    }

    const parsed = createComplexSchema.safeParse(datos)
    if (!parsed.success) {
      const errores: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const campo = String(issue.path[0])
        if (!errores[campo]) {
          errores[campo] = issue.message
        }
      }
      setFieldErrors(errores)
      return
    }

    setCargando(true)
    const res = await fetch(`/api/complexes/${complejo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })
    if (res.ok) {
      router.push(`/dueno/complejos/${complejo.id}`)
      router.refresh()
      return
    }
    const json = await res.json()
    setError(json.error)
    setCargando(false)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="nombre">Nombre del complejo</Label>
          <Input
            id="nombre"
            name="nombre"
            placeholder="Ej: El Ombú Fútbol & Pádel"
            defaultValue={complejo.nombre}
            aria-invalid={!!fieldErrors.nombre}
            className={fieldErrors.nombre ? claseInputConError : undefined}
          />
          <ErrorDeCampo mensaje={fieldErrors.nombre} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            name="direccion"
            placeholder="Ej: Av. San Martín 4520"
            defaultValue={complejo.direccion}
            aria-invalid={!!fieldErrors.direccion}
            className={fieldErrors.direccion ? claseInputConError : undefined}
          />
          <ErrorDeCampo mensaje={fieldErrors.direccion} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zona">Zona</Label>
          <Input
            id="zona"
            name="zona"
            placeholder="Ej: Villa Devoto, CABA"
            defaultValue={complejo.zona}
            aria-invalid={!!fieldErrors.zona}
            className={fieldErrors.zona ? claseInputConError : undefined}
          />
          <ErrorDeCampo mensaje={fieldErrors.zona} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contacto">Teléfono de contacto</Label>
          <Input
            id="contacto"
            name="contacto"
            type="tel"
            placeholder="Ej: 11 4589-2231"
            defaultValue={complejo.contacto}
            aria-invalid={!!fieldErrors.contacto}
            className={fieldErrors.contacto ? claseInputConError : undefined}
          />
          <ErrorDeCampo mensaje={fieldErrors.contacto} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="porcentajeSenaDefault">Seña por defecto (%)</Label>
          <Input
            id="porcentajeSenaDefault"
            name="porcentajeSenaDefault"
            type="number"
            min={0}
            max={100}
            defaultValue={complejo.porcentajeSenaDefault}
            aria-invalid={!!fieldErrors.porcentajeSenaDefault}
            className={fieldErrors.porcentajeSenaDefault ? claseInputConError : undefined}
          />
          <p className="text-muted-foreground text-xs">
            Se cobra al reservar en todas tus canchas. Una cancha puede tener su propio % (se
            configura al editarla).
          </p>
          <ErrorDeCampo mensaje={fieldErrors.porcentajeSenaDefault} />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          render={<Link href={`/dueno/complejos/${complejo.id}`} />}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={cargando}>
          {cargando ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {cargando ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}
    </form>
  )
}
