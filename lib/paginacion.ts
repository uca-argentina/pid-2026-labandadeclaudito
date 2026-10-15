// Para paginar en la base: a partir del ?pagina= que vino en la URL, qué
// página mostrar y cuántas filas saltear (el skip de Prisma).
// Si piden una página que no existe (?pagina=99, ?pagina=abc, ?pagina=1.5),
// se muestra la más cercana que sí existe.
export function calcularPagina(
  paginaPedida: unknown,
  totalDeFilas: number,
  filasPorPagina: number,
) {
  const totalPaginas = Math.max(Math.ceil(totalDeFilas / filasPorPagina), 1)
  const numero = Math.floor(Number(paginaPedida)) || 1
  const paginaActual = Math.min(Math.max(numero, 1), totalPaginas)

  return {
    paginaActual,
    totalPaginas,
    skip: (paginaActual - 1) * filasPorPagina,
  }
}
