// Bloque para cuando una pantalla no tiene nada que mostrar: una cancha en
// línea punteada, un título, una explicación y (opcional) el botón que saca
// de ese estado, que llega como children.
export function EstadoVacio({
  titulo,
  texto,
  children,
}: {
  titulo: string
  texto: string
  children?: React.ReactNode
}) {
  return (
    <div className="bg-card shadow-card flex flex-col items-center rounded-3xl px-8 py-12 text-center">
      <div className="bg-sand text-clay h-24 w-37 overflow-hidden rounded-2xl">
        <svg aria-hidden viewBox="0 0 148 96" className="size-full">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeDasharray="5 5"
            strokeLinecap="round"
          >
            <rect x="12" y="12" width="124" height="72" rx="2" />
            <line x1="74" y1="12" x2="74" y2="84" />
            <circle cx="74" cy="48" r="13" />
            <rect x="12" y="30" width="20" height="36" />
            <rect x="116" y="30" width="20" height="36" />
          </g>
        </svg>
      </div>
      <h3 className="font-heading mt-5 text-xl font-bold">{titulo}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">{texto}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}
