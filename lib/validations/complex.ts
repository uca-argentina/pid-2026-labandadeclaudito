import { z } from 'zod'
import { TODAS_LAS_ZONAS } from '@/lib/zonas'

function contarDigitos(texto: string) {
  let cantidad = 0
  for (const caracter of texto) {
    if (caracter >= '0' && caracter <= '9') {
      cantidad++
    }
  }
  return cantidad
}

export const createComplexSchema = z.object({
  nombre: z.string().trim().min(3, 'Ingresá el nombre del complejo.'),
  direccion: z.string().trim().min(4, 'Ingresá la dirección.'),
  zona: z
    .string()
    .refine((zona) => TODAS_LAS_ZONAS.includes(zona), { message: 'Elegí una zona de la lista.' }),
  contacto: z
    .string()
    .trim()
    .refine((telefono) => contarDigitos(telefono) >= 8, {
      message: 'Ingresá un teléfono con característica. Ej: 11 4589-2231',
    }),
  // % de seña por defecto de las canchas del complejo (30 si no se toca).
  // z.number() sin coerce: cada form convierte el string a número antes de
  // validar (react-hook-form con valueAsNumber, o Number() a mano).
  porcentajeSenaDefault: z
    .number()
    .int('Tiene que ser un número entero')
    .min(0, 'No puede ser negativo')
    .max(100, 'No puede ser mayor a 100'),
  // Minutos. En los forms se carga como HH:MM con un TimeSelect
  // (por eso el máximo es 23:59). Default: 3 h.
  minAdvanceMinutesDefault: z
    .number()
    .int('Tiene que ser un número entero')
    .min(0, 'No puede ser negativo')
    .max(1439, 'No puede ser más de 23:59 horas'),
  // Horas antes del turno hasta las que el jugador cancela con devolución de
  // la seña. Mínimo 4 horas, máximo una semana.
  cancellationHours: z
    .number('Ingresá una cantidad de horas')
    .int('Tiene que ser un número entero')
    .min(4, 'Tiene que ser de al menos 4 horas')
    .max(168, 'No puede ser más de 168 horas (una semana)'),
})

export type CreateComplexInput = z.infer<typeof createComplexSchema>

export const MAX_IMAGES_PER_COMPLEX = 5
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const complexImageSchema = z.object({
  imagen: z
    .instanceof(File, { message: 'Elegí una imagen.' })
    .refine((archivo) => archivo.size <= MAX_IMAGE_BYTES, {
      message: 'La foto pesa más de 4 MB.',
    })
    .refine((archivo) => ALLOWED_IMAGE_TYPES.includes(archivo.type), {
      message: 'Solo se aceptan fotos JPG, PNG o WebP.',
    }),
})

// El tipo del archivo lo manda el navegador según la extensión: un .txt
// renombrado a .png pasa el schema. Esto mira los primeros bytes, que en
// JPG, PNG y WebP son siempre los mismos.
export function esImagenReal(bytes: Uint8Array): boolean {
  const empiezaCon = (firma: number[], desde = 0) =>
    firma.every((byte, i) => bytes[desde + i] === byte)

  const jpg = empiezaCon([0xff, 0xd8, 0xff])
  const png = empiezaCon([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  // WebP: "RIFF", 4 bytes de tamaño, "WEBP"
  const webp = empiezaCon([0x52, 0x49, 0x46, 0x46]) && empiezaCon([0x57, 0x45, 0x42, 0x50], 8)
  return jpg || png || webp
}
