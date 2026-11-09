import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { del } from '@vercel/blob'
import { borrarDelBlob, subirArchivo } from '@/lib/blob'

vi.mock('@vercel/blob', () => ({ del: vi.fn() }))

describe('borrarDelBlob', () => {
  beforeEach(() => {
    vi.mocked(del).mockReset()
  })

  it('no toca el Blob con una foto que no es del Blob (las del seed)', async () => {
    await borrarDelBlob('https://images.unsplash.com/photo-1?w=256')
    expect(del).not.toHaveBeenCalled()
  })

  it('no toca el Blob con una foto local del seed', async () => {
    await borrarDelBlob('/seed/cancha-1.jpg')
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

// UPLOADS_LOCAL=true: los archivos van a public/uploads. process.cwd() apunta a
// una carpeta temporal para no escribir en el proyecto de verdad.
describe('archivos locales (UPLOADS_LOCAL=true)', () => {
  let proyecto = ''

  beforeEach(async () => {
    proyecto = await mkdtemp(path.join(tmpdir(), 'tocayjuga-'))
    vi.spyOn(process, 'cwd').mockReturnValue(proyecto)
    vi.stubEnv('UPLOADS_LOCAL', 'true')
  })

  afterEach(async () => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
    await rm(proyecto, { recursive: true, force: true })
  })

  it('guarda el archivo en public/uploads y devuelve la URL para mostrarlo', async () => {
    const url = await subirArchivo('usuarios/1', new File(['hola'], 'foto.jpg'))
    expect(url).toMatch(/^\/uploads\/usuarios\/1\/\d+-foto\.jpg$/)
    expect(await readFile(path.join(proyecto, 'public', url), 'utf-8')).toBe('hola')
  })

  it('un nombre con ../ no se sale de la carpeta', async () => {
    const url = await subirArchivo('usuarios/1', new File(['x'], '../../malo.jpg'))
    expect(url).toMatch(/^\/uploads\/usuarios\/1\/\d+-malo\.jpg$/)
  })

  it('borra el archivo local', async () => {
    const url = await subirArchivo('usuarios/1', new File(['hola'], 'foto.jpg'))
    await borrarDelBlob(url)
    await expect(stat(path.join(proyecto, 'public', url))).rejects.toThrow()
    expect(del).not.toHaveBeenCalled()
  })

  it('no borra nada fuera de public/uploads', async () => {
    await mkdir(path.join(proyecto, 'public', 'uploads'), { recursive: true })
    await writeFile(path.join(proyecto, 'secreto.txt'), 'no me borres')
    await borrarDelBlob('/uploads/../../secreto.txt')
    expect(await readFile(path.join(proyecto, 'secreto.txt'), 'utf-8')).toBe('no me borres')
  })
})
