'use client'

import { useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

// Busca mientras se escribe: actualiza ?q= en la URL y la página
// (server component) le pide a la base los usuarios que coinciden.
// Espera 300 ms sin teclear para no consultar la base con cada letra.
export function UserSearch({ busqueda }: { busqueda: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [texto, setTexto] = useState(busqueda)
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined)

  function buscar(nuevoTexto: string) {
    setTexto(nuevoTexto)
    clearTimeout(espera.current)
    espera.current = setTimeout(() => {
      // Conserva los filtros que ya estaban (estado, rol) y cambia solo q.
      // Borra pagina: una búsqueda nueva arranca siempre en la página 1.
      const params = new URLSearchParams(searchParams.toString())
      params.delete('pagina')
      if (nuevoTexto.trim()) params.set('q', nuevoTexto.trim())
      else params.delete('q')
      router.replace(`/admin/usuarios?${params.toString()}`)
    }, 300)
  }

  return (
    <div className="relative w-full sm:w-72">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2" />
      <Input
        type="search"
        value={texto}
        onChange={(e) => buscar(e.target.value)}
        placeholder="Buscar por nombre o email"
        aria-label="Buscar usuarios"
        className="bg-card pl-11"
      />
    </div>
  )
}
