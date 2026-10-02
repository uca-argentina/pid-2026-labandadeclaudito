// Helpers de horarios. Sin imports de db: los usa el server y también un
// componente cliente (el selector de turnos).

// Las canchas están en Argentina pero el servidor corre en UTC, así que "hoy"
// hay que pedirlo en esa zona o de noche se corre un día.
const ZONA_ARGENTINA = 'America/Argentina/Buenos_Aires'

export function sumarMinutos(hora: string, minutos: number): string {
  const [horaInicial, minutoInicial] = hora.split(':').map(Number)
  const total = horaInicial * 60 + minutoInicial + minutos

  const horas = String(Math.floor(total / 60) % 24).padStart(2, '0')
  const mins = String(total % 60).padStart(2, '0')
  return `${horas}:${mins}`
}

// Dos horarios del mismo día se superponen si cada uno empieza antes de que
// termine el otro. Un turno que termina a medianoche tiene fin "00:00", que
// como texto es menor que cualquier hora: se lo compara como "24:00".
export function horariosSeSuperponen(
  inicioA: string,
  finA: string,
  inicioB: string,
  finB: string,
): boolean {
  const finAComparable = finA === '00:00' ? '24:00' : finA
  const finBComparable = finB === '00:00' ? '24:00' : finB
  return inicioA < finBComparable && inicioB < finAComparable
}

// Que exista de verdad: "2026-02-31" tiene formato de fecha pero no es un día
// (new Date lo pasa al 3 de marzo sin avisar).
export function esDiaReal(texto: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false
  const fecha = new Date(`${texto}T00:00:00Z`)
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === texto
}

// Las fechas de reserva son un día de calendario (@db.Date) y Prisma las
// devuelve como medianoche UTC: hay que leer el día en UTC o en Argentina se
// ve el día anterior.
export function diaDeReserva(fecha: Date): string {
  return fecha.toISOString().slice(0, 10)
}

// fecha viene como YYYY-MM-DD y horaInicio como HH:MM, los dos con ceros
// adelante, así que alcanza con compararlos como texto.
// De YYYY-MM-DD a DD/MM/YYYY, que es como se muestra en pantalla.
export function formatearDia(dia: string): string {
  const [anio, mes, diaDelMes] = dia.split('-')
  return `${diaDelMes}/${mes}/${anio}`
}

// 'en-CA' formatea la fecha como YYYY-MM-DD.
export function diaDeHoy(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: ZONA_ARGENTINA })
}

// 0 (domingo) a 6 (sábado). Igual que diaDeReserva, se lee en UTC porque
// @db.Date llega como medianoche UTC.
export function diaSemanaDeReserva(fecha: Date): number {
  return fecha.getUTCDay()
}

// El momento actual escrito igual que lo guarda una reserva: día YYYY-MM-DD y
// hora HH:MM en Argentina. Recibe la fecha por parámetro para poder testear
// con una hora fija.
export function momentoActual(ahora: Date = new Date()): { dia: string; hora: string } {
  return {
    dia: ahora.toLocaleDateString('en-CA', { timeZone: ZONA_ARGENTINA }),
    hora: ahora.toLocaleTimeString('en-GB', {
      timeZone: ZONA_ARGENTINA,
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

export function turnoYaPaso(fecha: string, horaInicio: string): boolean {
  const ahora = new Date()
  const fechaDeHoy = diaDeHoy()
  // 'en-GB' formatea la hora como HH:MM.
  const horaDeAhora = ahora.toLocaleTimeString('en-GB', {
    timeZone: ZONA_ARGENTINA,
    hour: '2-digit',
    minute: '2-digit',
  })

  if (fecha < fechaDeHoy) return true
  if (fecha > fechaDeHoy) return false
  return horaInicio < horaDeAhora
}

// La anticipación se guarda en minutos, pero en los formularios se carga con
// un TimeSelect ("HH:MM"). Texto vacío = sin valor propio (null).
export function timeTextToMinutes(texto: string): number | null {
  if (texto === '') {
    return null
  }
  const [horas, minutos] = texto.split(':').map(Number)
  return horas * 60 + minutos
}

// 90 → "01:30", para precargar el TimeSelect
export function minutesToTimeText(totalMinutos: number): string {
  const horas = String(Math.floor(totalMinutos / 60)).padStart(2, '0')
  const minutos = String(totalMinutos % 60).padStart(2, '0')
  return `${horas}:${minutos}`
}

// 180 → "3 h", 90 → "1 h 30 min", 45 → "45 min"
export function formatAdvanceTime(totalMinutos: number): string {
  const horas = Math.floor(totalMinutos / 60)
  const minutos = totalMinutos % 60
  if (horas === 0) {
    return `${minutos} min`
  }
  if (minutos === 0) {
    return `${horas} h`
  }
  return `${horas} h ${minutos} min`
}

// Un turno se puede reservar si empieza después de "ahora + anticipación
// mínima". Se suma la anticipación al momento actual y recién después se
// pasa a día/hora de Argentina, así el límite puede caer al día siguiente.
export function isTooSoonToBook(
  fecha: string,
  horaInicio: string,
  minAdvanceMinutes: number,
  ahora: Date = new Date(),
): boolean {
  const momentoLimite = new Date(ahora.getTime() + minAdvanceMinutes * 60 * 1000)
  const limite = momentoActual(momentoLimite)

  if (fecha < limite.dia) return true
  if (fecha > limite.dia) return false
  return horaInicio < limite.hora
}

// Política de cancelación: se devuelve la seña si se cancela con al menos N
// horas de anticipación. Si el complejo cambió la política después de que el
// jugador pagó, vale la más favorable para el jugador (la de menos horas).
export function refundsDeposit(
  fecha: string,
  horaInicio: string,
  horasAlPagar: number,
  horasActuales: number,
  ahora: Date = new Date(),
): boolean {
  const horas = Math.min(horasAlPagar, horasActuales)
  const momentoLimite = new Date(ahora.getTime() + horas * 60 * 60 * 1000)
  const limite = momentoActual(momentoLimite)

  if (fecha < limite.dia) return false
  if (fecha > limite.dia) return true
  return horaInicio >= limite.hora
}

function horaTexto(totalMinutos: number): string {
  const minutosEnDia = totalMinutos % (24 * 60)
  const horas = String(Math.floor(minutosEnDia / 60)).padStart(2, '0')
  const minutos = String(minutosEnDia % 60).padStart(2, '0')
  return `${horas}:${minutos}`
}

function agregarSlots(
  slots: { horaInicio: string; horaFin: string }[],
  minutoInicio: number,
  minutoFin: number,
  duracionTurnoMin: number,
): void {
  let minuto = minutoInicio
  while (minuto + duracionTurnoMin <= minutoFin) {
    slots.push({ horaInicio: horaTexto(minuto), horaFin: horaTexto(minuto + duracionTurnoMin) })
    minuto += duracionTurnoMin
  }
  // Si sobra tiempo pero no alcanza para un turno completo, se arma uno más
  // corto con lo que queda en vez de perderlo (ej: 8 a 12 con turnos de 90
  // min da 2 turnos completos y un tercero de 60 min con el resto).
  if (minuto < minutoFin) {
    slots.push({ horaInicio: horaTexto(minuto), horaFin: horaTexto(minutoFin) })
  }
}

// Los turnos de una cancha entre apertura y cierre. Vive acá (no en
// lib/availability.ts, que importa Prisma) porque también lo usa el
// formulario de alta de canchas en el cliente para mostrar la cantidad de
// turnos en vivo, y un componente cliente no puede importar nada que
// arrastre el cliente de Prisma.
export function generateSlots(
  horaApertura: string,
  horaCierre: string,
  duracionTurnoMin: number,
): { horaInicio: string; horaFin: string }[] {
  const [horaAperturaH, horaAperturaM] = horaApertura.split(':').map(Number)
  const [horaCierreH, horaCierreM] = horaCierre.split(':').map(Number)

  const minutoInicio = horaAperturaH * 60 + horaAperturaM
  const minutoCierre = horaCierreH * 60 + horaCierreM

  const slots: { horaInicio: string; horaFin: string }[] = []

  // Si el cierre es a una hora "menor o igual" que la apertura, en realidad
  // cierra al día siguiente (ej: abre 20:00, cierra 03:00, o 08:00 a 00:00
  // que es "hasta medianoche"). Generamos primero los turnos de la
  // madrugada (00:00 al cierre) y después los de la noche (apertura a
  // medianoche), para que la lista quede ordenada de 00:00 a 23:xx.
  if (minutoCierre <= minutoInicio) {
    agregarSlots(slots, 0, minutoCierre, duracionTurnoMin)
    agregarSlots(slots, minutoInicio, 24 * 60, duracionTurnoMin)
  } else {
    agregarSlots(slots, minutoInicio, minutoCierre, duracionTurnoMin)
  }

  return slots
}

// La franja de un bloqueo o de un precio especial tiene que caer dentro del
// horario de la cancha. Igual que en generateSlots: si la cancha cierra a una
// hora "menor o igual" que la de apertura (20:00 a 03:00, o 08:00 a 00:00),
// los turnos del día van de 00:00 al cierre y de la apertura a medianoche, y
// la franja tiene que caer entera en uno de los dos tramos.
// La franja nunca cruza medianoche: los schemas exigen inicio < fin.
export function franjaDentroDelHorario(
  inicio: string,
  fin: string,
  horaApertura: string,
  horaCierre: string,
): boolean {
  if (horaCierre <= horaApertura) {
    return fin <= horaCierre || inicio >= horaApertura
  }
  return inicio >= horaApertura && fin <= horaCierre
}

export function mensajeFueraDelHorario(horaApertura: string, horaCierre: string): string {
  return `La cancha abre de ${horaApertura} a ${horaCierre}: la franja tiene que quedar dentro de ese horario.`
}

// Para precargar la franja de los formularios: todo el horario de la cancha.
// Si cierra a medianoche o después, llega hasta 23:59 (la franja no puede
// cruzar la medianoche).
export function finDeFranjaPorDefecto(horaApertura: string, horaCierre: string): string {
  return horaCierre > horaApertura ? horaCierre : '23:59'
}
