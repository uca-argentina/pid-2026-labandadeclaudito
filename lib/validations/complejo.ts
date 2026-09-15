import { z } from 'zod'

function contarDigitos(texto: string) {
  let cantidad = 0
  for (const caracter of texto) {
    if (caracter >= '0' && caracter <= '9') {
      cantidad++
    }
  }
  return cantidad
}

export const complejoSchema = z.object({
  nombre: z.string().trim().min(3, 'Ingresá el nombre del complejo.'),
  direccion: z.string().trim().min(4, 'Ingresá la dirección.'),
  zona: z.string().trim().min(3, 'Ingresá la zona.'),
  contacto: z
    .string()
    .trim()
    .refine((telefono) => contarDigitos(telefono) >= 8, {
      message: 'Ingresá un teléfono con característica. Ej: 11 4589-2231',
    }),
})

export type ComplejoForm = z.infer<typeof complejoSchema>
