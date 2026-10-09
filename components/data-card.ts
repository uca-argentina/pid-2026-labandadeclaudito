// El fondo de todos los recuadros de datos del dashboard del dueño: tarjeta
// sólida (blanca u oscura según el tema), con un degradé muy suave del color
// del deporte y una sombra que la levanta del fondo. Es una sola clase para
// que todas se vean iguales.
export const claseTarjetaDeDatos =
  'bg-card text-card-foreground from-card to-acento/7 border-acento/15 rounded-2xl border bg-linear-to-br shadow-lg shadow-acento/10'

// Para las que se pueden tocar (links): se levantan un poco más al pasar el
// mouse y se hunden apenas al presionarlas
export const claseTarjetaInteractiva =
  'transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-acento/15 active:scale-[0.98]'
