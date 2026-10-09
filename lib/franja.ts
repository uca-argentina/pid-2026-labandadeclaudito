// Cuentas para dibujar la barra de un día (00:00 a 24:00) en las vistas
// previas de precios y bloqueos. Archivo aparte de lib/time.ts a propósito.

const MINUTOS_DEL_DIA = 24 * 60

function aMinutos(hora: string): number {
  const [horas, minutos] = hora.split(':').map(Number)
  return horas * 60 + minutos
}

// Los tramos del día en que la cancha está abierta. Igual que en
// generateSlots: si cierra a una hora "menor o igual" que la de apertura
// (20:00 a 03:00, o 08:00 a 00:00), está abierta de 00:00 al cierre y de la
// apertura a medianoche.
export function tramosAbiertos(
  horaApertura: string,
  horaCierre: string,
): { desde: number; hasta: number }[] {
  const apertura = aMinutos(horaApertura)
  const cierre = aMinutos(horaCierre)

  if (cierre > apertura) {
    return [{ desde: apertura, hasta: cierre }]
  }

  const tramos: { desde: number; hasta: number }[] = []
  if (cierre > 0) {
    tramos.push({ desde: 0, hasta: cierre })
  }
  tramos.push({ desde: apertura, hasta: MINUTOS_DEL_DIA })
  return tramos
}

// Dónde va una franja en la barra, en % del día. Mientras el dueño elige los
// horarios la franja puede quedar al revés por un momento: ancho 0.
export function posicionEnElDia(
  desde: string,
  hasta: string,
): { izquierda: number; ancho: number } {
  const inicio = aMinutos(desde)
  const fin = aMinutos(hasta)
  return {
    izquierda: (inicio / MINUTOS_DEL_DIA) * 100,
    ancho: (Math.max(fin - inicio, 0) / MINUTOS_DEL_DIA) * 100,
  }
}
