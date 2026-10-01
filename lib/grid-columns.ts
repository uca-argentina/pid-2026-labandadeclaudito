// Clases de Tailwind para una grilla de tarjetas (complejos o canchas) que se
// adapta a la cantidad real de resultados: con pocos resultados, la grilla
// queda más angosta y centrada (no se estiran 2 tarjetas en un contenedor
// pensado para 4, que se ve descentrado); con 4 o más, llega hasta el ancho
// estándar de las páginas de contenido (max-w-5xl, el mismo que usan Inicio
// y Reservas) y nunca más de 4 columnas por fila.
export function clasesGrillaAdaptable(cantidadDeResultados: number): string {
  const columnas = Math.min(Math.max(cantidadDeResultados, 1), 4)

  const porColumnas: Record<number, string> = {
    1: 'max-w-xs grid-cols-1',
    2: 'max-w-xl grid-cols-1 sm:grid-cols-2',
    3: 'max-w-3xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return porColumnas[columnas]
}
