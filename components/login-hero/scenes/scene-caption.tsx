// Leyenda de cada escena, dentro del mismo SVG y del mismo grupo que la escena:
// así aparece y desaparece junto con ella y nunca se desfasa del video.
export const CAPTION_PAIN = 'Antes: llamar a cada complejo, uno por uno'
export const CAPTION_RESERVE = 'Elegí deporte, complejo y horario en segundos'
export const CAPTION_WAIT = 'Tu reserva te espera'
export const CAPTION_PLAY = 'Y llegás a jugar con tus amigos'

export function SceneCaption({
  text,
  tone = 'primary',
}: {
  text: string
  tone?: 'primary' | 'alert'
}) {
  return (
    <text
      x="200"
      y="326"
      fontSize="13"
      fontWeight="600"
      textAnchor="middle"
      className={tone === 'alert' ? 'fill-destructive' : 'fill-primary'}
    >
      {text}
    </text>
  )
}
