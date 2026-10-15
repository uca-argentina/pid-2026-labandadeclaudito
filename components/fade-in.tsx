// Hace aparecer su contenido desde un poco más abajo, con un fundido. orden
// (0, 1, 2…) retrasa cada uno un poco más que el anterior, así las secciones
// entran de a una. Solo al cargar la página: al cambiar un filtro el contenido
// ya está y no se vuelve a animar. Sin animación si el sistema pide reducir
// el movimiento (motion-safe).
export function FadeIn({ orden, children }: { orden: number; children: React.ReactNode }) {
  return (
    <div
      className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 fill-mode-backwards"
      style={{ animationDelay: `${orden * 90}ms`, animationDuration: '500ms' }}
    >
      {children}
    </div>
  )
}
