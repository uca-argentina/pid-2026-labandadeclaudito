import { ChevronDown, Mail, Phone } from 'lucide-react'
import { iniciales } from '@/lib/iniciales'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// Quién reservó, en las reservas del dueño: las iniciales y el nombre. El email
// y el teléfono se miran pocas veces, así que van en un globo que se abre al
// tocar el nombre, como links para escribirle o llamarlo.
export function ContactoDelJugador({
  jugador,
  className,
}: {
  jugador: { nombre: string; email: string; telefono: string | null }
  className?: string
}) {
  return (
    <Popover>
      <PopoverTrigger
        className={`hover:bg-muted flex w-full min-w-0 items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors ${className ?? ''}`}
      >
        <span className="bg-primary/15 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
          {iniciales(jugador.nombre)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{jugador.nombre}</span>
          <span className="text-muted-foreground block text-xs">Ver contacto</span>
        </span>
        <ChevronDown className="text-muted-foreground size-4 shrink-0" />
      </PopoverTrigger>

      <PopoverContent align="start" className="w-72 gap-1 rounded-2xl p-2">
        <p className="font-heading truncate px-2.5 pt-1.5 pb-1 font-bold">{jugador.nombre}</p>
        <a
          href={`mailto:${jugador.email}`}
          className="hover:bg-muted flex h-11 items-center gap-2.5 rounded-xl px-2.5"
        >
          <Mail className="text-muted-foreground size-4 shrink-0" />
          <span className="truncate">{jugador.email}</span>
        </a>
        {jugador.telefono ? (
          <a
            href={`tel:${jugador.telefono}`}
            className="hover:bg-muted flex h-11 items-center gap-2.5 rounded-xl px-2.5"
          >
            <Phone className="text-muted-foreground size-4 shrink-0" />
            {jugador.telefono}
          </a>
        ) : (
          <p className="text-muted-foreground flex h-11 items-center gap-2.5 px-2.5">
            <Phone className="size-4 shrink-0" />
            No cargó su teléfono
          </p>
        )}
      </PopoverContent>
    </Popover>
  )
}
