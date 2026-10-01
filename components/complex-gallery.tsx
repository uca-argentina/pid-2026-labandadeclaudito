'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

type ImagenDeGaleria = {
  id: string
  url: string
}

// Galería de fotos de un complejo. Al hacer click en cualquier foto se abre
// un visor a pantalla completa (overlay fijo, sin librería nueva) con
// flechas para moverse entre todas las fotos.
export function ComplexGallery({
  imagenes,
  nombreComplejo,
}: {
  imagenes: ImagenDeGaleria[]
  nombreComplejo: string
}) {
  const [indiceAbierto, setIndiceAbierto] = useState<number | null>(null)

  function irA(indice: number) {
    const total = imagenes.length
    // Módulo que nunca da negativo, para que "anterior" desde la primera foto
    // vaya a la última y viceversa.
    setIndiceAbierto(((indice % total) + total) % total)
  }

  // Con el visor abierto: flechas para moverse, Escape para cerrar. Se mueve
  // con el valor anterior del setState (no con `irA`) para no depender de una
  // función que cambia en cada render.
  useEffect(() => {
    if (indiceAbierto === null) return
    const total = imagenes.length

    function alApretarTecla(e: KeyboardEvent) {
      if (e.key === 'Escape') setIndiceAbierto(null)
      if (e.key === 'ArrowLeft') {
        setIndiceAbierto((actual) => (actual === null ? null : (actual - 1 + total) % total))
      }
      if (e.key === 'ArrowRight') {
        setIndiceAbierto((actual) => (actual === null ? null : (actual + 1) % total))
      }
    }

    window.addEventListener('keydown', alApretarTecla)
    return () => window.removeEventListener('keydown', alApretarTecla)
  }, [indiceAbierto, imagenes.length])

  if (imagenes.length === 0) {
    return null
  }

  const portada = imagenes[0]
  const otrasFotos = imagenes.slice(1)

  return (
    <>
      <div className="mb-6 space-y-2.5">
        {/* Proporción bien panorámica (no aspect-video): así la portada ocupa
            poco alto y, al entrar al complejo, entran en pantalla la foto,
            el título "Canchas disponibles" y al menos una fila de canchas
            sin tener que scrollear. Las miniaturas también van más bajas
            (16:9 en vez de 4:3) por la misma razón. */}
        <button
          type="button"
          onClick={() => setIndiceAbierto(0)}
          className="relative aspect-3/1 w-full overflow-hidden rounded-2xl border"
        >
          <Image
            src={portada.url}
            alt={`Foto de ${nombreComplejo}`}
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
        </button>
        {otrasFotos.length > 0 && (
          <div className="grid grid-cols-4 gap-2.5">
            {otrasFotos.map((foto, indice) => (
              <button
                key={foto.id}
                type="button"
                onClick={() => irA(indice + 1)}
                className="relative aspect-video overflow-hidden rounded-lg border"
              >
                <Image
                  src={foto.url}
                  alt={`Foto de ${nombreComplejo}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {indiceAbierto !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIndiceAbierto(null)}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setIndiceAbierto(null)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          {imagenes.length > 1 && (
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={(e) => {
                e.stopPropagation()
                irA(indiceAbierto - 1)
              }}
              className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={imagenes[indiceAbierto].url}
              alt={`Foto de ${nombreComplejo}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {imagenes.length > 1 && (
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={(e) => {
                e.stopPropagation()
                irA(indiceAbierto + 1)
              }}
              className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <ChevronRight className="size-6" />
            </button>
          )}

          {imagenes.length > 1 && (
            <span className="absolute bottom-4 text-sm text-white/80">
              {indiceAbierto + 1} / {imagenes.length}
            </span>
          )}
        </div>
      )}
    </>
  )
}
