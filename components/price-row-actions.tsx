'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DeletePriceDialog } from '@/components/delete-price-dialog'

export function PriceRowActions({
  complejoId,
  courtId,
  priceId,
}: {
  complejoId: string
  courtId: string
  priceId: string
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
              aria-label="Editar precio"
              render={
                <Link
                  href={`/dueno/complejos/${complejoId}/canchas/${courtId}/precios/${priceId}/editar`}
                />
              }
            />
          }
        >
          <Pencil />
        </TooltipTrigger>
        <TooltipContent>Editar</TooltipContent>
      </Tooltip>
      <DeletePriceDialog priceId={priceId} onDeleted={() => router.refresh()} />
    </div>
  )
}
