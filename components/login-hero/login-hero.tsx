import { BookingChips } from './scenes/booking-chips'
import { LaptopScene } from './scenes/laptop-scene'
import { LogoTransition } from './scenes/logo-transition'
import { PhoneScene } from './scenes/phone-scene'
import { SportsMontage } from './scenes/sports-montage'
import './login-hero.css'

// Panel izquierdo del login/registro. FUERA DEL ALCANCE DEL PARCIAL: es una
// animación decorativa en SVG + CSS puro (ver login-hero.css para el loop).
// Todas las escenas comparten el mismo viewBox 400x300 y se apilan una encima
// de otra dentro del "escenario"; cada una aparece y desaparece con opacity.
export function LoginHero() {
  return (
    <aside className="bg-secondary border-border hidden flex-col justify-center border-r px-12 py-16 lg:flex">
      <div className="mx-auto w-full max-w-lg space-y-10">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold">Reservá tu cancha en segundos</h2>
          <p className="text-muted-foreground text-base">
            Fútbol, pádel, básquet, tenis y más. Elegí complejo, horario y jugá con tus amigos.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="hero-stage border-border bg-background relative aspect-4/3 w-full overflow-hidden rounded-3xl border"
        >
          <LaptopScene />
          <PhoneScene />
          <LogoTransition />
          <SportsMontage />
          <BookingChips />
        </div>
      </div>
    </aside>
  )
}
