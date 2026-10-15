import { del } from '@vercel/blob'

// Borra un archivo viejo del Blob para que no quede huérfano. Las fotos del
// seed son de Unsplash, no del Blob: del() tira error con esas, así que se
// saltean. Si el Blob falla, el pedido ya hizo su trabajo en la base: se
// loguea y sigue, en vez de responder 500 con los cambios ya guardados.
export async function borrarDelBlob(url: string) {
  if (!new URL(url).hostname.endsWith('.public.blob.vercel-storage.com')) return
  try {
    await del(url)
  } catch (error) {
    console.error('No se pudo borrar el archivo del Blob:', url, error)
  }
}
