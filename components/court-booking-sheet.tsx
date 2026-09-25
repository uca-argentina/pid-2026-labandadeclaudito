'use client'

import { CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { CourtSlotPicker } from '@/components/court-slot-picker'
import { formatPrecio } from '@/lib/labels'

export function CourtBookingSheet({
  courtId,
  courtName,
  courtSportLabel,
  precioBase,
  duracionTurnoMin,
  fechaInicial,
}: {
  courtId: string
  courtName: string
  courtSportLabel: string
  precioBase: string
  duracionTurnoMin: number
  fechaInicial?: string
}) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button>
            <CalendarPlus className="size-3.5" />
            Reservar
          </Button>
        }
      />
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{courtName}</SheetTitle>
          <SheetDescription>
            {courtSportLabel} · {formatPrecio(precioBase)} por turno de {duracionTurnoMin} min
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <CourtSlotPicker
            courtId={courtId}
            courtName={courtName}
            duracionTurnoMin={duracionTurnoMin}
            fechaInicial={fechaInicial}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
