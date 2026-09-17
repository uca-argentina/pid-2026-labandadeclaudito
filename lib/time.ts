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
