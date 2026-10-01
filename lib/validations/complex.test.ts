import { describe, expect, test } from 'vitest'
import { complexImageSchema, createComplexSchema, esImagenReal, MAX_IMAGE_BYTES } from './complex'

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
    cancellationHours: 24,
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

describe('createComplexSchema — política de cancelación', () => {
  const base = {
    nombre: 'El Ombú',
    direccion: 'Av. San Martín 4520',
    zona: 'Palermo',
    contacto: '11 4589-2231',
    porcentajeSenaDefault: 30,
    minAdvanceMinutesDefault: 180,
  }

  test('acepta entre 4 y 168 horas', () => {
    expect(createComplexSchema.safeParse({ ...base, cancellationHours: 4 }).success).toBe(true)
    expect(createComplexSchema.safeParse({ ...base, cancellationHours: 168 }).success).toBe(true)
  })

  test('rechaza menos de 4 horas', () => {
    expect(createComplexSchema.safeParse({ ...base, cancellationHours: 3 }).success).toBe(false)
  })

  test('rechaza más de una semana', () => {
    expect(createComplexSchema.safeParse({ ...base, cancellationHours: 169 }).success).toBe(false)
  })

  test('rechaza el campo vacío', () => {
    expect(createComplexSchema.safeParse({ ...base, cancellationHours: NaN }).success).toBe(false)
  })
})

describe('esImagenReal', () => {
  test('reconoce PNG, JPG y WebP por sus primeros bytes', () => {
    expect(esImagenReal(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(
      true,
    )
    expect(esImagenReal(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe(true)
    expect(esImagenReal(new TextEncoder().encode('RIFF1234WEBPVP8 '))).toBe(true)
  })

  test('rechaza un texto con extensión de imagen', () => {
    expect(esImagenReal(new TextEncoder().encode('hola\n'))).toBe(false)
  })
})
