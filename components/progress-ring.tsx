// Tiene que coincidir con el 327 del @keyframes llenar-anillo de globals.css
const RADIO = 52
const LARGO_DEL_CIRCULO = 2 * Math.PI * RADIO

// Anillo que se llena según el porcentaje. Al aparecer se llena desde 0 y, si
// cambia el porcentaje (otro filtro), se mueve hasta el nuevo con transición.
// El tamaño y los colores los decide quien lo usa (className y clases de trazo).
export function ProgressRing({
  porcentaje,
  className,
  claseFondo,
  claseRelleno,
  children,
}: {
  porcentaje: number
  className: string
  claseFondo: string
  claseRelleno: string
  children: React.ReactNode
}) {
  const sinLlenar = LARGO_DEL_CIRCULO * (1 - porcentaje / 100)

  return (
    <div className={`relative shrink-0 ${className}`}>
      {/* -rotate-90: que el anillo empiece a llenarse desde arriba */}
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={RADIO} fill="none" strokeWidth="10" className={claseFondo} />
        <circle
          cx="60"
          cy="60"
          r={RADIO}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={LARGO_DEL_CIRCULO}
          strokeDashoffset={sinLlenar}
          className={`${claseRelleno} transition-[stroke-dashoffset] duration-700 ease-out motion-safe:animate-llenar-anillo`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}
