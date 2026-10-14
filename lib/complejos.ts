import type { Prisma } from '@/lib/generated/prisma/client'

// Los complejos que un jugador puede ver y reservar: no dados de baja,
// aprobados por un admin y de un dueño que no está suspendido. Va en toda
// consulta del lado del jugador (búsqueda, detalle, turnos libres, reservar)
// para que un complejo sin aprobar no se cuele por ninguna.
export function complejoVisible(): Prisma.ComplejoWhereInput {
  return {
    activo: true,
    estadoAprobacion: 'APROBADO',
    duenio: { activo: true },
  }
}

// Los que esperan una decisión del admin. Los de un dueño suspendido no
// cuentan: aunque se aprueben, no los vería nadie.
export function complejoPorAprobar(): Prisma.ComplejoWhereInput {
  return {
    activo: true,
    estadoAprobacion: 'PENDIENTE',
    duenio: { activo: true },
  }
}
