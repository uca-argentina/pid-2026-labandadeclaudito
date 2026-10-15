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
// children (opcional): lo que va escrito encima de la portada, abajo a la
// izquierda (el nombre y la dirección del complejo).
export function ComplexGallery({
  imagenes,
  nombreComplejo,
  children,
}: {
  imagenes: ImagenDeGaleria[]
  nombreComplejo: string
  children?: React.ReactNode
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
      {/* La portada en grande y, al costado, las dos fotos que siguen (desde
          sm). Si hay más, la última dice cuántas faltan; todas se ven en el
          visor. */}
      <div
        className={
          otrasFotos.length > 0
            ? 'mb-7 grid h-56 gap-3 sm:h-75 sm:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]'
            : 'mb-7 grid h-56 sm:h-75'
        }
      >
        <div className="relative overflow-hidden rounded-3xl">
          <button
            type="button"
            aria-label="Ver las fotos"
            onClick={() => setIndiceAbierto(0)}
            className="absolute inset-0"
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
          {children && (
            <>
              {/* Degradé oscuro para que el texto se lea sobre cualquier foto.
                  pointer-events-none: el click pasa a la foto de abajo. */}
              <div
                aria-hidden
                className="from-sidebar/90 via-sidebar/75 pointer-events-none absolute inset-x-0 bottom-0 h-4/5 bg-linear-to-t via-45% to-transparent"
              />
              <div className="text-sidebar-foreground pointer-events-none absolute inset-x-6 bottom-5 sm:inset-x-7 sm:bottom-6">
                {children}
              </div>
            </>
          )}
        </div>

        {otrasFotos.length > 0 && (
          <div className="hidden grid-rows-2 gap-3 sm:grid">
            {otrasFotos.slice(0, 2).map((foto, indice) => (
              <button
                key={foto.id}
                type="button"
                onClick={() => irA(indice + 1)}
                className="relative overflow-hidden rounded-2xl"
              >
                <Image
                  src={foto.url}
                  alt={`Foto de ${nombreComplejo}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
                {indice === 1 && otrasFotos.length > 2 && (
                  <span className="bg-sidebar/70 text-sidebar-foreground absolute inset-0 flex items-center justify-center text-lg font-semibold">
                    +{otrasFotos.length - 2}
                  </span>
                )}
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
