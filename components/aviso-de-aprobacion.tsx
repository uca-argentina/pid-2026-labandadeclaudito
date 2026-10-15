import Link from 'next/link'
import { CircleX, Hourglass, Pencil } from 'lucide-react'
import type { EstadoAprobacion } from '@/lib/generated/prisma/client'
import { Button } from '@/components/ui/button'

// Arriba de la página del complejo del dueño: le cuenta si todavía no lo ven
// los jugadores y, si se lo rechazaron, por qué y cómo reenviarlo.
export function AvisoDeAprobacion({
  complejoId,
  estadoAprobacion,
  motivoRechazo,
}: {
  complejoId: string
  estadoAprobacion: EstadoAprobacion
  motivoRechazo: string | null
}) {
  if (estadoAprobacion === 'APROBADO') return null

  if (estadoAprobacion === 'PENDIENTE') {
    return (
      <div className="bg-clay/12 mb-7 flex items-start gap-3.5 rounded-2xl p-5">
        <Hourglass className="text-clay-foreground mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-semibold">Tu complejo está en revisión</p>
          <p className="text-foreground/80 mt-1 text-sm">
            Mientras tanto podés cargar canchas, precios y fotos. Los jugadores lo van a ver apenas
            lo aprobemos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-destructive/8 mb-7 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-start gap-3.5">
        <CircleX className="text-destructive mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-semibold">No pudimos aprobar tu complejo</p>
          <p className="text-foreground/80 mt-1 text-sm">{motivoRechazo}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Cuando guardes los cambios, vuelve a revisión.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        className="shrink-0"
        render={<Link href={`/dueno/complejos/${complejoId}/editar`} />}
      >
        <Pencil className="size-4" />
        Corregir y reenviar
      </Button>
    </div>
  )
}
