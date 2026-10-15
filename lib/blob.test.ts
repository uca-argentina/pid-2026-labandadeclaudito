import { beforeEach, describe, expect, it, vi } from 'vitest'
import { del } from '@vercel/blob'
import { borrarDelBlob } from '@/lib/blob'

vi.mock('@vercel/blob', () => ({ del: vi.fn() }))

describe('borrarDelBlob', () => {
  beforeEach(() => {
    vi.mocked(del).mockReset()
  })

  it('no toca el Blob con una foto que no es del Blob (las del seed)', async () => {
    await borrarDelBlob('https://images.unsplash.com/photo-1?w=256')
    expect(del).not.toHaveBeenCalled()
  })

  it('borra una foto del Blob', async () => {
    const url = 'https://abc.public.blob.vercel-storage.com/usuarios/1/foto.jpg'
    await borrarDelBlob(url)
    expect(del).toHaveBeenCalledWith(url)
  })

  it('si el Blob falla, no tira error', async () => {
    vi.mocked(del).mockRejectedValue(new Error('caído'))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    await expect(
      borrarDelBlob('https://abc.public.blob.vercel-storage.com/x.jpg'),
    ).resolves.toBeUndefined()
  })
})
