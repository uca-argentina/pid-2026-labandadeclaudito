import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FormNuevoComplejo } from '@/components/form-nuevo-complejo'

export const metadata: Metadata = {
  title: 'Crear complejo | TocaYJuga',
}

export default function CrearComplejoPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dueno/complejos"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-4" /> Volver a mis complejos
      </Link>
      <h1 className="text-3xl font-semibold">Nuevo complejo</h1>
      <p className="text-muted-foreground mt-1 mb-6 text-sm">
        Cargá los datos del complejo. Después vas a poder agregar sus canchas.
      </p>

      <FormNuevoComplejo />
    </main>
  )
}
