'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        render={
          <Link
            href={`/dueno/complejos/${complejoId}/canchas/${courtId}/precios/${priceId}/editar`}
          />
        }
      >
        <Pencil className="size-3.5" />
        Editar
      </Button>
      <DeletePriceDialog priceId={priceId} onDeleted={() => router.refresh()} />
    </div>
  )
}
