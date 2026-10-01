import { describe, expect, test } from 'vitest'
import { complexImageSchema, createComplexSchema, MAX_IMAGE_BYTES } from './complex'

describe('complexImageSchema', () => {
  test('acepta una foto PNG chica', () => {
    const archivo = new File(['123'], 'foto.png', { type: 'image/png' })
    expect(complexImageSchema.safeParse({ imagen: archivo }).success).toBe(true)
  })

  test('rechaza una foto de más de 4 MB', () => {
    const contenido = new Uint8Array(MAX_IMAGE_BYTES + 1)
    const archivo = new File([contenido], 'grande.jpg', { type: 'image/jpeg' })
    expect(complexImageSchema.safeParse({ imagen: archivo }).success).toBe(false)
  })

  test('rechaza un archivo que no es imagen', () => {
    const archivo = new File(['hola'], 'notas.txt', { type: 'text/plain' })
    expect(complexImageSchema.safeParse({ imagen: archivo }).success).toBe(false)
  })

  test('rechaza cuando no se manda archivo', () => {
    expect(complexImageSchema.safeParse({ imagen: null }).success).toBe(false)
  })
})

describe('createComplexSchema — zona', () => {
  const base = {
    nombre: 'El Ombú',
    direccion: 'Av. San Martín 4520',
    contacto: '11 4589-2231',
    porcentajeSenaDefault: 30,
    minAdvanceMinutesDefault: 180,
  }

  test('acepta un barrio de la lista fija', () => {
    expect(createComplexSchema.safeParse({ ...base, zona: 'Palermo' }).success).toBe(true)
  })

  test('acepta una localidad de la provincia de Buenos Aires', () => {
    expect(createComplexSchema.safeParse({ ...base, zona: 'Tigre' }).success).toBe(true)
  })

  test('rechaza una zona que no está en la lista', () => {
    expect(createComplexSchema.safeParse({ ...base, zona: 'Marte' }).success).toBe(false)
  })
})
