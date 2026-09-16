'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        render={<Link href={`/dueno/complejos/${complejoId}/canchas/${courtId}/editar`} />}
      >
        <Pencil className="size-3.5" />
        Editar
      </Button>
      <DeleteCourtDialog
        courtId={courtId}
        courtName={courtName}
        onDeleted={() => router.refresh()}
      />
    </div>
  )
}
