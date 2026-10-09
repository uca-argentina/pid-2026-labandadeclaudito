// Clases de Tailwind para una grilla de tarjetas (complejos o canchas) que se
// adapta a la cantidad real de resultados: con pocos resultados, la grilla
// queda más angosta (no se estiran 2 tarjetas en todo el ancho); con 4 o más,
// ocupa todo el lugar y nunca pasa de 4 columnas por fila.
//
// Las columnas se eligen por el ancho del CONTENEDOR (@lg:, @3xl:...), no de la
// pantalla: la misma grilla vive al lado de los filtros (columna angosta) y a
// todo el ancho (mis complejos). Por eso el padre tiene que tener la clase
// @container. @lg = 32rem, @3xl = 48rem, @5xl = 64rem: ~250px por tarjeta.
export function clasesGrillaAdaptable(cantidadDeResultados: number): string {
  const columnas = Math.min(Math.max(cantidadDeResultados, 1), 4)

  const porColumnas: Record<number, string> = {
    1: 'max-w-xs grid-cols-1',
    2: 'max-w-xl grid-cols-1 @lg:grid-cols-2',
    3: 'max-w-4xl grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3',
    4: 'grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4',
  }

  return porColumnas[columnas]
}
