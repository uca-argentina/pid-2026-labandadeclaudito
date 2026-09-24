import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { del, put } from '@vercel/blob'
import { POST as crearComplejo } from '@/app/api/complexes/route'
import { PATCH as editarComplejo } from '@/app/api/complexes/[id]/route'
import { POST as subirFoto } from '@/app/api/complexes/[id]/images/route'
import { DELETE as quitarFoto } from '@/app/api/complexes/[id]/images/[imageId]/route'
import { POST as crearCanchas } from '@/app/api/complexes/[id]/courts/route'
import { PATCH as editarCancha } from '@/app/api/courts/[id]/route'
import { db } from '@/lib/db'
import {
  archivoImagen,
  conParams,
  crearUsuario,
  datosDeCanchas,
  datosDeComplejo,
  imagenRequest,
  jsonRequest,
  limpiarDatosDeTest,
  loginComo,
  sinSesion,
} from './helpers'

type Usuario = Awaited<ReturnType<typeof crearUsuario>>

let duenio: Usuario
let otroDuenio: Usuario
let jugador: Usuario
let complejoId: string

beforeAll(async () => {
  await limpiarDatosDeTest()
  duenio = await crearUsuario('DUENIO')
  otroDuenio = await crearUsuario('DUENIO')
  jugador = await crearUsuario('JUGADOR')
})

afterAll(async () => {
  sinSesion()
  await limpiarDatosDeTest()
})

beforeEach(() => {
  vi.mocked(put).mockClear()
  vi.mocked(del).mockClear()
})

describe('Alta de complejo (POST /api/complexes)', () => {
  test('sin sesión devuelve 401', async () => {
    sinSesion()
    const res = await crearComplejo(jsonRequest('POST', datosDeComplejo))
    expect(res.status).toBe(401)
  })

  test('un jugador no puede crear complejos (403)', async () => {
    loginComo(jugador)
    const res = await crearComplejo(jsonRequest('POST', datosDeComplejo))
    expect(res.status).toBe(403)
  })

  test('con datos inválidos devuelve 400', async () => {
    loginComo(duenio)
    const res = await crearComplejo(jsonRequest('POST', { ...datosDeComplejo, contacto: '123' }))
    expect(res.status).toBe(400)
  })

  test('el dueño lo crea y el duenioId sale de la sesión, no del body', async () => {
    loginComo(duenio)
    const res = await crearComplejo(
      jsonRequest('POST', { ...datosDeComplejo, duenioId: otroDuenio.id }),
    )
    expect(res.status).toBe(201)

    const json = await res.json()
    complejoId = json.id
    const complejo = await db.complejo.findUnique({ where: { id: complejoId } })
    expect(complejo?.duenioId).toBe(duenio.id)
    expect(complejo?.activo).toBe(true)
  })
})

describe('Edición de complejo (PATCH /api/complexes/[id])', () => {
  test('el dueño edita sus datos', async () => {
    loginComo(duenio)
    const res = await editarComplejo(
      jsonRequest('PATCH', { ...datosDeComplejo, zona: 'Zona editada' }),
      conParams({ id: complejoId }),
    )
    expect(res.status).toBe(200)

    const complejo = await db.complejo.findUnique({ where: { id: complejoId } })
    expect(complejo?.zona).toBe('Zona editada')
  })

  test('otro dueño no puede editarlo (404)', async () => {
    loginComo(otroDuenio)
    const res = await editarComplejo(
      jsonRequest('PATCH', { ...datosDeComplejo, nombre: '[TEST] Hackeado' }),
      conParams({ id: complejoId }),
    )
    expect(res.status).toBe(404)

    const complejo = await db.complejo.findUnique({ where: { id: complejoId } })
    expect(complejo?.nombre).toBe(datosDeComplejo.nombre)
  })

  test('con datos inválidos devuelve 400', async () => {
    loginComo(duenio)
    const res = await editarComplejo(
      jsonRequest('PATCH', { ...datosDeComplejo, nombre: '' }),
      conParams({ id: complejoId }),
    )
    expect(res.status).toBe(400)
  })
})

describe('Fotos del complejo', () => {
  test('el dueño sube una foto válida', async () => {
    loginComo(duenio)
    const res = await subirFoto(imagenRequest(archivoImagen()), conParams({ id: complejoId }))
    expect(res.status).toBe(201)
    expect(put).toHaveBeenCalledTimes(1)

    const fotos = await db.imagenComplejo.findMany({ where: { complejoId } })
    expect(fotos.length).toBe(1)
    expect(fotos[0].orden).toBe(0)
  })

  test('rechaza un archivo que no es imagen (400)', async () => {
    loginComo(duenio)
    const res = await subirFoto(
      imagenRequest(archivoImagen('text/plain')),
      conParams({ id: complejoId }),
    )
    expect(res.status).toBe(400)
    expect(put).not.toHaveBeenCalled()
  })

  test('otro dueño no puede subir fotos (404)', async () => {
    loginComo(otroDuenio)
    const res = await subirFoto(imagenRequest(archivoImagen()), conParams({ id: complejoId }))
    expect(res.status).toBe(404)
  })

  test('no deja pasar de 5 fotos (409)', async () => {
    loginComo(duenio)
    for (let i = 0; i < 4; i++) {
      const res = await subirFoto(imagenRequest(archivoImagen()), conParams({ id: complejoId }))
      expect(res.status).toBe(201)
    }

    const sexta = await subirFoto(imagenRequest(archivoImagen()), conParams({ id: complejoId }))
    expect(sexta.status).toBe(409)
  })

  test('quitar una foto la borra de la DB y del Blob', async () => {
    loginComo(duenio)
    const foto = await db.imagenComplejo.findFirst({
      where: { complejoId },
      orderBy: { orden: 'asc' },
    })

    const res = await quitarFoto(
      jsonRequest('DELETE'),
      conParams({ id: complejoId, imageId: foto!.id }),
    )
    expect(res.status).toBe(200)
    expect(del).toHaveBeenCalledWith(foto!.url)

    const borrada = await db.imagenComplejo.findUnique({ where: { id: foto!.id } })
    expect(borrada).toBeNull()
  })

  test('otro dueño no puede quitar fotos (404)', async () => {
    loginComo(otroDuenio)
    const foto = await db.imagenComplejo.findFirst({ where: { complejoId } })

    const res = await quitarFoto(
      jsonRequest('DELETE'),
      conParams({ id: complejoId, imageId: foto!.id }),
    )
    expect(res.status).toBe(404)
    expect(del).not.toHaveBeenCalled()
  })

  test('una foto nueva queda después de la última, aunque haya huecos en el orden', async () => {
    loginComo(duenio)
    const res = await subirFoto(imagenRequest(archivoImagen()), conParams({ id: complejoId }))
    expect(res.status).toBe(201)

    const json = await res.json()
    const nueva = await db.imagenComplejo.findUnique({ where: { id: json.id } })
    // Se subieron 5 (orden 0 a 4) y se quitó la de orden 0: la nueva va en 5
    expect(nueva?.orden).toBe(5)
  })
})

describe('Canchas del complejo', () => {
  test('un jugador no puede crear canchas (403)', async () => {
    loginComo(jugador)
    const res = await crearCanchas(
      jsonRequest('POST', datosDeCanchas),
      conParams({ id: complejoId }),
    )
    expect(res.status).toBe(403)
  })

  test('otro dueño no puede crear canchas en este complejo (404)', async () => {
    loginComo(otroDuenio)
    const res = await crearCanchas(
      jsonRequest('POST', datosDeCanchas),
      conParams({ id: complejoId }),
    )
    expect(res.status).toBe(404)
  })

  test('el dueño crea canchas en lote', async () => {
    loginComo(duenio)
    const res = await crearCanchas(
      jsonRequest('POST', datosDeCanchas),
      conParams({ id: complejoId }),
    )
    expect(res.status).toBe(201)

    const canchas = await db.cancha.findMany({
      where: { complejoId },
      orderBy: { nombre: 'asc' },
    })
    expect(canchas.length).toBe(2)
    expect(canchas[0].nombre).toBe('Cancha 1')
    expect(canchas[1].nombre).toBe('Cancha 2')
  })

  test('el dueño edita una cancha y otro dueño no puede (404)', async () => {
    const cancha = await db.cancha.findFirst({ where: { complejoId } })
    const datosEditados = {
      nombre: 'Cancha editada',
      deporte: 'FUTBOL_7',
      tipoSuperficie: 'CEMENTO',
      precioBase: 20000,
      horaApertura: '09:00',
      horaCierre: '13:00',
      duracionTurnoMin: 60,
      porcentajeSena: null,
    }

    loginComo(otroDuenio)
    const resAjeno = await editarCancha(
      jsonRequest('PATCH', datosEditados),
      conParams({ id: cancha!.id }),
    )
    expect(resAjeno.status).toBe(404)

    loginComo(duenio)
    const res = await editarCancha(
      jsonRequest('PATCH', datosEditados),
      conParams({ id: cancha!.id }),
    )
    expect(res.status).toBe(200)

    const editada = await db.cancha.findUnique({ where: { id: cancha!.id } })
    expect(editada?.nombre).toBe('Cancha editada')
    expect(Number(editada?.precioBase)).toBe(20000)
  })
})
