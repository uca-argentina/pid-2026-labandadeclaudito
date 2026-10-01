'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// No dibuja nada. Cuando vence el plazo para pagar la seña, vuelve a pedirle
// la página al server: la reserva vencida ya no viene en la consulta y su
// tarjeta desaparece. Corre solo en el navegador mientras la página está
// abierta (no es un cron: no escribe nada en la base).
export function RefreshWhenDepositExpires({ venceEn }: { venceEn: string }) {
  const router = useRouter()

  useEffect(() => {
    const msHastaVencer = new Date(venceEn).getTime() - Date.now()
    // Un segundo de margen para que el server ya la considere vencida.
    const id = setTimeout(() => router.refresh(), msHastaVencer + 1000)
    return () => clearTimeout(id)
  }, [venceEn, router])

  return null
}
