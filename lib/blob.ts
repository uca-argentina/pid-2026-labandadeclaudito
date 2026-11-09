import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { del, put } from '@vercel/blob'

// Con UPLOADS_LOCAL=true (el parcial, sin internet) los archivos se guardan en
// public/uploads en vez de en Vercel Blob. Next los sirve desde /uploads/...
function guardaEnDisco() {
  return process.env.UPLOADS_LOCAL === 'true'
}

function carpetaLocal() {
  return path.join(process.cwd(), 'public', 'uploads')
}

// Sube un archivo y devuelve la URL con la que se muestra.
// carpeta: dónde va, por ejemplo "usuarios/123" (la arma el servidor, no el usuario).
export async function subirArchivo(carpeta: string, archivo: File): Promise<string> {
  if (!guardaEnDisco()) {
    const blob = await put(`${carpeta}/${archivo.name}`, archivo, {
      access: 'public',
      addRandomSuffix: true,
    })
    return blob.url
  }

  // basename: aunque el nombre del archivo traiga "../", no sale de la carpeta
  const nombre = `${Date.now()}-${path.basename(archivo.name)}`
  await mkdir(path.join(carpetaLocal(), carpeta), { recursive: true })
  await writeFile(
    path.join(carpetaLocal(), carpeta, nombre),
    Buffer.from(await archivo.arrayBuffer()),
  )
  return `/uploads/${carpeta}/${nombre}`
}

// Borra un archivo viejo para que no quede huérfano. Las fotos del seed no son
// del Blob (son de public/seed o de Unsplash): del() tira error con esas, así
// que se saltean. Si el borrado falla, el pedido ya hizo su trabajo en la base:
// se loguea y sigue, en vez de responder 500 con los cambios ya guardados.
export async function borrarDelBlob(url: string) {
  if (url.startsWith('/uploads/')) {
    const archivo = path.join(process.cwd(), 'public', url)
    // La ruta viene de la base, pero igual se chequea que quede dentro de uploads
    if (archivo.startsWith(carpetaLocal() + path.sep)) {
      await unlink(archivo).catch(() => {})
    }
    return
  }
  if (url.startsWith('/')) return // foto del seed (public/seed)
  if (!new URL(url).hostname.endsWith('.public.blob.vercel-storage.com')) return
  try {
    await del(url)
  } catch (error) {
    console.error('No se pudo borrar el archivo del Blob:', url, error)
  }
}
