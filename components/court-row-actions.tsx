'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CalendarOff, DollarSign, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DeleteCourtDialog } from '@/components/delete-court-dialog'

export function CourtRowActions({
  complejoId,
  courtId,
  courtName,
}: {
  complejoId: string
  courtId: string
  courtName: string
}) {
  const router = useRouter()

  return (
    <div className="flex justify-end gap-1.5">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Precios especiales"
              render={<Link href={`/dueno/complejos/${complejoId}/canchas/${courtId}/precios`} />}
            />
          }
        >
          <DollarSign />
        </TooltipTrigger>
        <TooltipContent>Precios especiales</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Bloqueos"
              render={<Link href={`/dueno/complejos/${complejoId}/canchas/${courtId}/bloqueos`} />}
            />
          }
        >
          <CalendarOff />
        </TooltipTrigger>
        <TooltipContent>Bloqueos</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Editar cancha"
              render={<Link href={`/dueno/complejos/${complejoId}/canchas/${courtId}/editar`} />}
            />
          }
        >
          <Pencil />
        </TooltipTrigger>
        <TooltipContent>Editar</TooltipContent>
      </Tooltip>

      <DeleteCourtDialog
        courtId={courtId}
        courtName={courtName}
        onDeleted={() => router.refresh()}
      />
    </div>
  )
}
