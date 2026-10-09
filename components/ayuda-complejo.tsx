import { Camera, Eye, Percent } from 'lucide-react'

// Panel fijo al costado de los formularios de complejo. Los forms de complejo no
// guardan sus campos en estado, así que en lugar de vista previa va una ayuda.
export function AyudaComplejo() {
  return (
    <div className="border-border bg-card space-y-5 rounded-2xl border p-5 text-sm">
      <div className="flex gap-3">
        <Eye className="text-primary mt-0.5 size-4 shrink-0" />
        <p>
          <span className="font-semibold">Lo que ven los jugadores:</span> el nombre, la dirección,
          la zona y el contacto aparecen en la búsqueda y en la página del complejo.
        </p>
      </div>
      <div className="flex gap-3">
        <Percent className="text-primary mt-0.5 size-4 shrink-0" />
        <p>
          <span className="font-semibold">Seña y cancelación:</span> son los valores por defecto de
          todas las canchas. Cada cancha puede tener su propia seña.
        </p>
      </div>
      <div className="flex gap-3">
        <Camera className="text-primary mt-0.5 size-4 shrink-0" />
        <p>
          <span className="font-semibold">Fotos:</span> la primera es la portada en la búsqueda. Un
          complejo con fotos se elige mucho más.
        </p>
      </div>
    </div>
  )
}
