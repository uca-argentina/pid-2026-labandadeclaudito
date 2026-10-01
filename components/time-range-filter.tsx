'use client'

import { useState } from 'react'
import { TimeSelect } from '@/components/time-select'

// Las dos puntas del filtro de horario son opcionales ("sin elegir nada" no
// se puede representar con un TimeSelect, a diferencia del input type="time"
// nativo que quedaba vacío): un checkbox por lado decide si ese límite se
// manda o no en la búsqueda.
export function TimeRangeFilter({
  horaDesdeInicial,
  horaHastaInicial,
}: {
  horaDesdeInicial?: string
  horaHastaInicial?: string
}) {
  const [usaDesde, setUsaDesde] = useState(horaDesdeInicial !== undefined)
  const [horaDesde, setHoraDesde] = useState(horaDesdeInicial ?? '00:00')
  const [usaHasta, setUsaHasta] = useState(horaHastaInicial !== undefined)
  const [horaHasta, setHoraHasta] = useState(horaHastaInicial ?? '23:00')

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={usaDesde}
            onChange={(e) => setUsaDesde(e.target.checked)}
          />
          Desde
        </label>
        {usaDesde && <TimeSelect value={horaDesde} onChange={setHoraDesde} />}
        <input type="hidden" name="horaDesde" value={usaDesde ? horaDesde : ''} />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={usaHasta}
            onChange={(e) => setUsaHasta(e.target.checked)}
          />
          Hasta
        </label>
        {usaHasta && <TimeSelect value={horaHasta} onChange={setHoraHasta} />}
        <input type="hidden" name="horaHasta" value={usaHasta ? horaHasta : ''} />
      </div>
    </div>
  )
}
