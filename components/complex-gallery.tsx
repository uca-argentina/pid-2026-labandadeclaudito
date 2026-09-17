import Image from 'next/image'

type ImagenDeGaleria = {
  id: string
  url: string
}

export function ComplexGallery({
  imagenes,
  nombreComplejo,
}: {
  imagenes: ImagenDeGaleria[]
  nombreComplejo: string
}) {
  if (imagenes.length === 0) {
    return null
  }

  const portada = imagenes[0]
  const otrasFotos = imagenes.slice(1)

  return (
    <div className="mb-8 space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-2xl border">
        <Image
          src={portada.url}
          alt={`Foto de ${nombreComplejo}`}
          fill
          priority
          sizes="(min-width: 896px) 896px, 100vw"
          className="object-cover"
        />
      </div>
      {otrasFotos.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {otrasFotos.map((foto) => (
            <div key={foto.id} className="relative aspect-4/3 overflow-hidden rounded-lg border">
              <Image
                src={foto.url}
                alt={`Foto de ${nombreComplejo}`}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
