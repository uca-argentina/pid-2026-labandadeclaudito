import { describe, expect, test } from 'vitest'
import { complexImageSchema, MAX_IMAGE_BYTES } from './complex'

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
