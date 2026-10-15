import { Camera, Eye, Percent } from 'lucide-react'

// Panel fijo al costado de los formularios de complejo. Los forms de complejo no
// guardan sus campos en estado, así que en lugar de vista previa va una ayuda.
export function AyudaComplejo() {
  return (
    <div className="bg-clay/12 space-y-5 rounded-3xl p-6 text-sm">
      <div className="flex gap-3">
        <Eye className="text-clay-foreground mt-0.5 size-4 shrink-0" />
        <p>
          <span className="font-semibold">Lo que ven los jugadores:</span> el nombre, la dirección,
          la zona y el contacto aparecen en la búsqueda y en la página del complejo.
        </p>
      </div>
      <div className="flex gap-3">
        <Percent className="text-clay-foreground mt-0.5 size-4 shrink-0" />
        <p>
          <span className="font-semibold">Seña y cancelación:</span> son los valores por defecto de
          todas las canchas. Cada cancha puede tener su propia seña.
        </p>
      </div>
      <div className="flex gap-3">
        <Camera className="text-clay-foreground mt-0.5 size-4 shrink-0" />
        <p>
          <span className="font-semibold">Fotos:</span> la primera es la portada en la búsqueda. Un
          complejo con fotos se elige mucho más.
        </p>
      </div>
    </div>
  )
}
