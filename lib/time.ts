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
// un input type="time" ("HH:MM"). Input vacío = sin valor propio (null).
export function timeTextToMinutes(texto: string): number | null {
  if (texto === '') {
    return null
  }
  const [horas, minutos] = texto.split(':').map(Number)
  return horas * 60 + minutos
}

// 90 → "01:30", para precargar el input type="time"
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
