'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        render={
          <Link
            href={`/dueno/complejos/${complejoId}/canchas/${courtId}/bloqueos/${blockId}/editar`}
          />
        }
      >
        <Pencil className="size-3.5" />
        Editar
      </Button>
      <DeleteBlockDialog blockId={blockId} onDeleted={() => router.refresh()} />
    </div>
  )
}
