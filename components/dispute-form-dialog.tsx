'use client'

import { useState, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ImagePlus, Loader2, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  createDisputeSchema,
  disputeEvidenceSchema,
  MAX_EVIDENCIAS_POR_DISPUTA,
} from '@/lib/validations/dispute'

export function DisputeFormDialog({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [descripcion, setDescripcion] = useState('')
  const [pruebas, setPruebas] = useState<File[]>([])
  const [error, setError] = useState('')
  const [errorDeDescripcion, setErrorDeDescripcion] = useState('')
  const [enviando, setEnviando] = useState(false)

  function elegirPruebas(event: ChangeEvent<HTMLInputElement>) {
    const elegidos = event.target.files
    if (!elegidos) return
    setError('')

    const nuevas = [...pruebas]
    for (const archivo of Array.from(elegidos)) {
      if (nuevas.length === MAX_EVIDENCIAS_POR_DISPUTA) {
        setError(`Podés subir hasta ${MAX_EVIDENCIAS_POR_DISPUTA} imágenes.`)
        break
      }
      const parsed = disputeEvidenceSchema.safeParse({ archivo })
      if (!parsed.success) {
        setError(`${archivo.name}: ${parsed.error.issues[0].message}`)
        continue
      }
      nuevas.push(archivo)
    }

    setPruebas(nuevas)
    // Vaciar el input para que se pueda volver a elegir el mismo archivo
    event.target.value = ''
  }

  function quitarPrueba(indice: number) {
    setPruebas(pruebas.filter((_, i) => i !== indice))
  }

  // Primero se crea la disputa y después se suben las imágenes, una por
  // request: el endpoint las necesita colgadas de una disputa que ya exista.
  async function enviar() {
    setError('')
    setErrorDeDescripcion('')

    const parsed = createDisputeSchema.safeParse({ reservaId: bookingId, descripcion })
    if (!parsed.success) {
      setErrorDeDescripcion(parsed.error.issues[0].message)
      return
    }

    setEnviando(true)
    const res = await fetch('/api/disputes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setEnviando(false)
      return
    }

    for (const archivo of pruebas) {
      const formData = new FormData()
      formData.append('archivo', archivo)
      const resDeLaPrueba = await fetch(`/api/disputes/${json.disputa.id}/evidence`, {
        method: 'POST',
        body: formData,
      })
      if (!resDeLaPrueba.ok) {
        // La disputa ya quedó abierta: avisamos cuál prueba no entró, sin
        // perder el reclamo
        const jsonDeLaPrueba = await resDeLaPrueba
          .json()
          .catch(() => ({ error: `error ${resDeLaPrueba.status} del servidor` }))
        setError(`Tu disputa se abrió, pero ${archivo.name} no se pudo subir:
          ${jsonDeLaPrueba.error}`)
        setEnviando(false)
        router.refresh()
        return
      }
    }

    setAbierto(false)
    setEnviando(false)
    router.refresh()
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>Disputar</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disputar la falta</DialogTitle>
          <DialogDescription>
            El complejo te marcó como ausente. Contanos qué pasó y lo revisa un administrador de
            TocaYJuga.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion">¿Qué pasó?</Label>
            <Textarea
              id="descripcion"
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Contanos por qué no estás de acuerdo con la falta"
              aria-invalid={!!errorDeDescripcion}
            />
            {errorDeDescripcion && (
              <p className="text-destructive flex items-center gap-1 text-xs font-medium">
                <AlertCircle className="size-3.5" />
                {errorDeDescripcion}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tus pruebas</Label>
            <p className="text-muted-foreground text-sm">
              Hasta {MAX_EVIDENCIAS_POR_DISPUTA} imágenes · JPG, PNG o WebP de 4 MB como máximo.
            </p>

            {pruebas.length > 0 && (
              <ul className="space-y-1">
                {pruebas.map((archivo, indice) => (
                  <li
                    key={archivo.name}
                    className="bg-secondary flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm"
                  >
                    <span className="truncate">{archivo.name}</span>
                    <button
                      type="button"
                      onClick={() => quitarPrueba(indice)}
                      aria-label={`Quitar ${archivo.name}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {pruebas.length < MAX_EVIDENCIAS_POR_DISPUTA && (
              <label
                htmlFor="pruebas"
                className="text-muted-foreground hover:bg-accent flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed px-3 py-3 text-sm font-medium"
              >
                <ImagePlus className="size-4" />
                Agregar imagen
              </label>
            )}
            <input
              id="pruebas"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={enviando}
              className="hidden"
              onChange={elegirPruebas}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm font-medium">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setAbierto(false)}>
            Volver
          </Button>
          <Button onClick={enviar} disabled={enviando}>
            {enviando && <Loader2 className="size-4 animate-spin" />}
            {enviando ? 'Enviando...' : 'Enviar la disputa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
