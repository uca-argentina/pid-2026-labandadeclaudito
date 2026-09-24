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

export const createComplexSchema = z.object({
  nombre: z.string().trim().min(3, 'Ingresá el nombre del complejo.'),
  direccion: z.string().trim().min(4, 'Ingresá la dirección.'),
  zona: z.string().trim().min(3, 'Ingresá la zona.'),
  contacto: z
    .string()
    .trim()
    .refine((telefono) => contarDigitos(telefono) >= 8, {
      message: 'Ingresá un teléfono con característica. Ej: 11 4589-2231',
    }),
  // % de seña por defecto de las canchas del complejo. No se pide al crear
  // (el form de alta lo manda fijo en 30); se ajusta después desde "Editar
  // complejo". z.number() sin coerce: cada form convierte el string a número
  // antes de validar (react-hook-form con valueAsNumber, o Number() a mano).
  porcentajeSenaDefault: z
    .number()
    .int('Tiene que ser un número entero')
    .min(0, 'No puede ser negativo')
    .max(100, 'No puede ser mayor a 100'),
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
