'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DeleteBlockDialog } from '@/components/delete-block-dialog'

export function BlockRowActions({
  complejoId,
  courtId,
  blockId,
}: {
  complejoId: string
  courtId: string
  blockId: string
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
              aria-label="Editar bloqueo"
              render={
                <Link
                  href={`/dueno/complejos/${complejoId}/canchas/${courtId}/bloqueos/${blockId}/editar`}
                />
              }
            />
          }
        >
          <Pencil />
        </TooltipTrigger>
        <TooltipContent>Editar</TooltipContent>
      </Tooltip>
      <DeleteBlockDialog blockId={blockId} onDeleted={() => router.refresh()} />
    </div>
  )
}
