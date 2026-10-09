import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FormNuevoComplejo } from '@/components/form-nuevo-complejo'
import { AyudaComplejo } from '@/components/ayuda-complejo'

export const metadata: Metadata = {
  title: 'Crear complejo | TocaYJuga',
}

export default function CrearComplejoPage() {
  return (
    <main>
      <Link
        href="/dueno/complejos"
        className="text-muted-foreground hover:text-foreground mb-2 inline-flex h-8 items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-4" /> Volver a mis complejos
      </Link>
      <h1 className="text-3xl font-semibold">Nuevo complejo</h1>
      <p className="text-muted-foreground mt-1 mb-6 text-sm">
        Cargá los datos del complejo. Después vas a poder agregar sus canchas.
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <FormNuevoComplejo />
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <AyudaComplejo />
        </aside>
      </div>
    </main>
  )
}
