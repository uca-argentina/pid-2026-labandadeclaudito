import { nombresCortosDeDias, mesesCortos, nombresDeDias, nombresDeMeses } from '@/lib/labels'
import { sumarDias } from '@/lib/time'

// Períodos de calendario del dashboard del dueño: un día, una semana (de
// lunes a domingo) o un mes. Las fechas son días YYYY-MM-DD, como en lib/time.ts.

export type Vista = 'dia' | 'semana' | 'mes'

// Lo que se puede elegir en el selector: los períodos de calendario o un
// rango de fechas a mano
export type VistaDelSelector = Vista | 'rango'

export type Periodo = { desde: string; hasta: string }

// 0 (domingo) a 6 (sábado). Se lee en UTC para que la zona del servidor no
// corra el día.
export function diaSemanaDe(dia: string): number {
  return new Date(`${dia}T00:00:00Z`).getUTCDay()
}

function primeroDelMes(anio: number, mes: number): string {
  // Date.UTC acomoda solo los meses fuera de rango (mes 0 → diciembre anterior)
  return new Date(Date.UTC(anio, mes - 1, 1)).toISOString().slice(0, 10)
}

// El período (de la vista elegida) que contiene a la fecha
export function periodoQueContiene(fecha: string, vista: Vista): Periodo {
  if (vista === 'dia') return { desde: fecha, hasta: fecha }

  if (vista === 'semana') {
    // Cuántos días pasaron desde el lunes (el domingo es el último de la semana)
    const desdeElLunes = (diaSemanaDe(fecha) + 6) % 7
    const lunes = sumarDias(fecha, -desdeElLunes)
    return { desde: lunes, hasta: sumarDias(lunes, 6) }
  }

  const anio = Number(fecha.slice(0, 4))
  const mes = Number(fecha.slice(5, 7))
  const desde = primeroDelMes(anio, mes)
  // El último día del mes es el anterior al primero del mes siguiente
  const hasta = sumarDias(primeroDelMes(anio, mes + 1), -1)
  return { desde, hasta }
}

// Una fecha del período de al lado (paso -1: el anterior, 1: el siguiente)
export function fechaDelPeriodoVecino(fecha: string, vista: Vista, paso: 1 | -1): string {
  if (vista === 'dia') return sumarDias(fecha, paso)
  if (vista === 'semana') return sumarDias(fecha, 7 * paso)

  const anio = Number(fecha.slice(0, 4))
  const mes = Number(fecha.slice(5, 7))
  return primeroDelMes(anio, mes + paso)
}

// Los días de la semana (0 = domingo) que tiene el período, sin repetir
export function diasDeLaSemanaDe(periodo: Periodo): number[] {
  const dias: number[] = []
  for (let i = 0; i < Math.min(cantidadDeDias(periodo), 7); i++) {
    dias.push(diaSemanaDe(sumarDias(periodo.desde, i)))
  }
  return dias
}

export function cantidadDeDias(periodo: Periodo): number {
  const desde = new Date(`${periodo.desde}T00:00:00Z`).getTime()
  const hasta = new Date(`${periodo.hasta}T00:00:00Z`).getTime()
  return Math.round((hasta - desde) / (24 * 60 * 60 * 1000)) + 1
}

function diaCorto(dia: string): string {
  const numero = Number(dia.slice(8, 10))
  const mes = mesesCortos[Number(dia.slice(5, 7)) - 1]
  return `${numero} ${mes}`
}

// El nombre que se muestra en el selector: "Hoy", "Esta semana", "Septiembre 2026"...
export function nombreDelPeriodo(fecha: string, vista: Vista, hoy: string): string {
  const periodo = periodoQueContiene(fecha, vista)
  const periodoDeHoy = periodoQueContiene(hoy, vista)
  const periodoPasado = periodoQueContiene(fechaDelPeriodoVecino(hoy, vista, -1), vista)

  if (vista === 'dia') {
    if (periodo.desde === periodoDeHoy.desde) return 'Hoy'
    if (periodo.desde === periodoPasado.desde) return 'Ayer'
    return `${nombresCortosDeDias[diaSemanaDe(fecha)]} ${diaCorto(fecha)}`
  }

  if (vista === 'semana') {
    if (periodo.desde === periodoDeHoy.desde) return 'Esta semana'
    if (periodo.desde === periodoPasado.desde) return 'Semana pasada'
    return `${diaCorto(periodo.desde)} – ${diaCorto(periodo.hasta)}`
  }

  if (periodo.desde === periodoDeHoy.desde) return 'Este mes'
  const mes = nombresDeMeses[Number(periodo.desde.slice(5, 7)) - 1]
  return `${mes} ${periodo.desde.slice(0, 4)}`
}

// Contra qué se compara cada vista (para los textos de "vs. ...")
export const comparacionDeLaVista: Record<Vista, string> = {
  dia: 'el día anterior',
  semana: 'la semana anterior',
  mes: 'el mes anterior',
}

export const nombreDelAnterior: Record<Vista, string> = {
  dia: 'Día anterior',
  semana: 'Semana anterior',
  mes: 'Mes anterior',
}

// Los dos rangos que se comparan. Un período que todavía está en curso (esta
// semana, este mes) se mide hasta hoy, y se compara contra el mismo tramo del
// anterior: del 1 al 7 de este mes contra del 1 al 7 del mes pasado. Comparar
// medio mes contra un mes entero haría parecer que siempre se va peor.
export function rangosAComparar(
  fecha: string,
  vista: Vista,
  hoy: string,
): { actual: Periodo; anterior: Periodo } {
  const periodo = periodoQueContiene(fecha, vista)
  const actual = { desde: periodo.desde, hasta: periodo.hasta < hoy ? periodo.hasta : hoy }

  const periodoAnterior = periodoQueContiene(fechaDelPeriodoVecino(periodo.desde, vista, -1), vista)
  // Si el período ya terminó, se compara contra el anterior entero
  if (periodo.hasta <= hoy) return { actual, anterior: periodoAnterior }

  const mismoTramo = sumarDias(periodoAnterior.desde, cantidadDeDias(actual) - 1)
  const anterior = {
    desde: periodoAnterior.desde,
    hasta: mismoTramo < periodoAnterior.hasta ? mismoTramo : periodoAnterior.hasta,
  }

  return { actual, anterior }
}

// El título del selector, con la fecha completa como en un calendario:
// "Miércoles 7 de octubre", "5 – 11 de octubre de 2026", "Octubre de 2026"
export function tituloDelPeriodo(fecha: string, vista: Vista): string {
  const periodo = periodoQueContiene(fecha, vista)
  const anio = periodo.desde.slice(0, 4)
  const mesDesde = nombresDeMeses[Number(periodo.desde.slice(5, 7)) - 1].toLowerCase()

  if (vista === 'dia') {
    const dia = Number(fecha.slice(8, 10))
    return `${nombresDeDias[diaSemanaDe(fecha)]} ${dia} de ${mesDesde}`
  }

  if (vista === 'semana') {
    const diaDesde = Number(periodo.desde.slice(8, 10))
    const diaHasta = Number(periodo.hasta.slice(8, 10))
    // Si la semana cruza de un mes al otro se nombran los dos
    if (periodo.desde.slice(5, 7) !== periodo.hasta.slice(5, 7)) {
      return `${diaCorto(periodo.desde)} – ${diaCorto(periodo.hasta)} ${periodo.hasta.slice(0, 4)}`
    }
    return `${diaDesde} – ${diaHasta} de ${mesDesde} de ${anio}`
  }

  return `${nombresDeMeses[Number(periodo.desde.slice(5, 7)) - 1]} de ${anio}`
}

// ---------- Rangos elegidos a mano ----------

// Como mucho un año: más que eso trae demasiados datos de golpe
export const MAXIMO_DE_DIAS_DEL_RANGO = 366

// Un rango elegido a mano, ya validado: sin fechas son los últimos 30 días;
// desde y hasta al revés se acomodan; nada en el futuro; como mucho 366 días.
export function rangoValido(
  desde: string | undefined,
  hasta: string | undefined,
  hoy: string,
): Periodo {
  let fin = hasta ?? hoy
  let inicio = desde ?? sumarDias(fin, -29)
  if (inicio > fin) {
    const auxiliar = inicio
    inicio = fin
    fin = auxiliar
  }
  if (fin > hoy) fin = hoy
  if (inicio > fin) inicio = fin
  if (cantidadDeDias({ desde: inicio, hasta: fin }) > MAXIMO_DE_DIAS_DEL_RANGO) {
    inicio = sumarDias(fin, -(MAXIMO_DE_DIAS_DEL_RANGO - 1))
  }
  return { desde: inicio, hasta: fin }
}

// El rango del mismo largo justo antes (paso -1) o justo después (paso 1)
export function rangoVecino(rango: Periodo, paso: 1 | -1): Periodo {
  const largo = cantidadDeDias(rango)
  return {
    desde: sumarDias(rango.desde, largo * paso),
    hasta: sumarDias(rango.hasta, largo * paso),
  }
}

// "3 – 9 oct 2026", "28 sep – 4 oct 2026", "28 dic 2025 – 4 ene 2026"
export function tituloDelRango(rango: Periodo): string {
  const anioDesde = rango.desde.slice(0, 4)
  const anioHasta = rango.hasta.slice(0, 4)
  if (rango.desde === rango.hasta) return `${diaCorto(rango.desde)} ${anioHasta}`
  if (anioDesde !== anioHasta) {
    return `${diaCorto(rango.desde)} ${anioDesde} – ${diaCorto(rango.hasta)} ${anioHasta}`
  }
  if (rango.desde.slice(5, 7) === rango.hasta.slice(5, 7)) {
    const mes = mesesCortos[Number(rango.desde.slice(5, 7)) - 1]
    return `${Number(rango.desde.slice(8, 10))} – ${Number(rango.hasta.slice(8, 10))} ${mes} ${anioHasta}`
  }
  return `${diaCorto(rango.desde)} – ${diaCorto(rango.hasta)} ${anioHasta}`
}

// ---------- El período elegido en el selector, ya resuelto ----------

// La parte de fechas de los filtros de la URL
export type FechasDelFiltro = { fecha?: string; desde?: string; hasta?: string }

export type PeriodoElegido = {
  // Lo que se mide y contra qué se compara
  actual: Periodo
  anterior: Periodo
  titulo: string
  // Solo en el período actual o en un rango (vacío si no hay nada que aclarar)
  subtitulo: string
  esElActual: boolean
  // "vs. la semana anterior"
  comparacion: string
  nombreDelAnterior: string
  // Las fechas para cada botón del selector y para los links
  fechasActuales: FechasDelFiltro
  fechasAnterior: FechasDelFiltro
  fechasSiguiente: FechasDelFiltro
  fechasDeHoy: FechasDelFiltro
  fechasPorVista: Record<VistaDelSelector, FechasDelFiltro>
}

function periodoDeUnRango(entrada: FechasDelFiltro, hoy: string): PeriodoElegido {
  const actual = rangoValido(entrada.desde, entrada.hasta, hoy)
  const dias = cantidadDeDias(actual)
  const esElActual = actual.hasta === hoy
  const anterior = rangoVecino(actual, -1)
  const siguiente = rangoVecino(actual, 1)
  // Al pasar a día, semana o mes se mira el período del último día del rango
  const ancla = esElActual ? undefined : actual.hasta
  const textoDeDias = dias === 1 ? '1 día' : `${dias} días`

  return {
    actual,
    anterior,
    titulo: tituloDelRango(actual),
    subtitulo: esElActual ? `Últimos ${textoDeDias}` : textoDeDias,
    esElActual,
    comparacion: dias === 1 ? 'el día anterior' : `los ${dias} días anteriores`,
    nombreDelAnterior: 'Período anterior',
    fechasActuales: { desde: actual.desde, hasta: actual.hasta },
    fechasAnterior: { desde: anterior.desde, hasta: anterior.hasta },
    fechasSiguiente: { desde: siguiente.desde, hasta: siguiente.hasta },
    // Mismo largo, terminando hoy
    fechasDeHoy: { desde: sumarDias(hoy, -(dias - 1)), hasta: hoy },
    fechasPorVista: {
      dia: { fecha: ancla },
      semana: { fecha: ancla },
      mes: { fecha: ancla },
      rango: { desde: actual.desde, hasta: actual.hasta },
    },
  }
}

// Resuelve lo que viene en la URL: qué se mide, contra qué se compara, qué
// textos mostrar y a qué fechas lleva cada botón. Sin fecha es el período de
// hoy; no hay datos del futuro, así que una fecha posterior también es hoy.
export function periodoElegido(
  vista: VistaDelSelector,
  entrada: FechasDelFiltro,
  hoy: string,
): PeriodoElegido {
  if (vista === 'rango') return periodoDeUnRango(entrada, hoy)

  let fecha = entrada.fecha ?? hoy
  if (periodoQueContiene(fecha, vista).desde > periodoQueContiene(hoy, vista).desde) {
    fecha = hoy
  }
  const esElActual = periodoQueContiene(fecha, vista).desde === periodoQueContiene(hoy, vista).desde
  const rangos = rangosAComparar(fecha, vista, hoy)
  const nombre = nombreDelPeriodo(fecha, vista, hoy)
  // La fecha va en la URL solo si no es el período de hoy
  const ancla = esElActual ? undefined : fecha

  let subtitulo = ''
  if (esElActual) subtitulo = vista === 'dia' ? 'Hoy' : `${nombre} · hasta hoy`

  return {
    actual: rangos.actual,
    anterior: rangos.anterior,
    titulo: tituloDelPeriodo(fecha, vista),
    subtitulo,
    esElActual,
    comparacion: comparacionDeLaVista[vista],
    nombreDelAnterior: nombreDelAnterior[vista],
    fechasActuales: { fecha: ancla },
    fechasAnterior: { fecha: fechaDelPeriodoVecino(fecha, vista, -1) },
    fechasSiguiente: { fecha: fechaDelPeriodoVecino(fecha, vista, 1) },
    fechasDeHoy: {},
    fechasPorVista: {
      // Se queda en la misma fecha: de "Día" a "Mes" muestra el mes de ese día
      dia: { fecha: ancla },
      semana: { fecha: ancla },
      mes: { fecha: ancla },
      // Pasar a rango arranca con lo que se estaba mirando
      rango: { desde: rangos.actual.desde, hasta: rangos.actual.hasta },
    },
  }
}
