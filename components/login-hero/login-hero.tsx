import { Building2, CalendarCheck, Clock, Pause, Play, Trophy } from 'lucide-react'
import { FootballScene } from './scenes/football-scene'
import { LaptopScene } from './scenes/laptop-scene'
import { PadelScene } from './scenes/padel-scene'
import { PainScene } from './scenes/pain-scene'
import { PhoneScene } from './scenes/phone-scene'
import { TimeScene } from './scenes/time-scene'
import { Logo } from '@/components/logo'
import './login-hero.css'

const BENEFITS = [
  { icon: Trophy, text: 'Fútbol, pádel, básquet, tenis y más deportes' },
  { icon: Building2, text: 'Todos los complejos en un solo lugar' },
  { icon: Clock, text: 'Horarios libres al instante, sin llamar' },
  { icon: CalendarCheck, text: 'Cancelá hasta 24 hs antes si cambian los planes' },
]

// Panel izquierdo del login/registro. FUERA DEL ALCANCE DEL PARCIAL: es una
// animación decorativa en SVG + CSS puro (ver login-hero.css para el loop).
// Cuenta dos historias de grupos distintos: dolor → reserva del grupo A (fútbol)
// → pasa el tiempo → llegan y juegan → reserva del grupo B (pádel) → pasa el
// tiempo → llegan y juegan. Todas las escenas comparten el mismo viewBox 400x300
// y se apilan una encima de otra dentro del "escenario"; cada una aparece y
// desaparece con opacity.
// El panel queda fijo (sticky) para que no se mueva si el formulario es alto.
// Va en el verde oscuro del sidebar (igual en los dos temas): al entrar, ese
// mismo verde queda como la barra de la app.
export function LoginHero() {
  return (
    <aside className="bg-sidebar text-sidebar-foreground relative hidden flex-col px-12 py-9 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:self-start lg:overflow-y-auto">
      {/* Líneas de una cancha, apenas visibles, de fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          viewBox="0 0 300 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          className="absolute -bottom-20 -left-28 w-190 opacity-6"
        >
          <rect x="10" y="10" width="280" height="180" />
          <line x1="150" y1="10" x2="150" y2="190" />
          <circle cx="150" cy="100" r="34" />
          <rect x="10" y="48" width="56" height="104" />
          <rect x="10" y="76" width="24" height="48" />
          <rect x="234" y="48" width="56" height="104" />
        </svg>
      </div>

      <div className="relative mx-auto flex w-full max-w-lg items-center gap-2.5">
        <Logo className="size-9" sobreFondoOscuro />
        <span className="font-brand text-2xl font-extrabold tracking-tight">
          Toca<span className="text-sidebar-primary">Y</span>Juga
        </span>
      </div>

      <div className="hero-stage relative m-auto w-full max-w-lg space-y-6 pt-8">
        <div className="space-y-3">
          <h2 className="font-heading text-5xl font-bold tracking-tight [@media(max-height:820px)]:text-4xl">
            Reservá tu cancha en segundos
          </h2>
          <p className="text-sidebar-foreground/75 text-lg [@media(max-height:820px)]:text-base">
            Sin llamar complejo por complejo. Elegí deporte, complejo y horario, y jugá con tus
            amigos.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="hero-frame bg-background text-foreground relative aspect-[400/340] w-full overflow-hidden rounded-3xl shadow-2xl"
        >
          <PainScene />
          <LaptopScene />
          <TimeScene id="a" sport="futbol" title="Fútbol 5 · Sáb 21:00" complex="Complejo Oeste" />
          <FootballScene />
          <PhoneScene />
          <TimeScene id="b" sport="padel" title="Pádel · Dom 20:00" complex="Club Palermo" />
          <PadelScene />
        </div>

        <ul className="space-y-2 text-sm [@media(max-height:820px)]:hidden">
          {BENEFITS.map((benefit) => (
            <li key={benefit.text} className="flex items-center gap-2">
              <benefit.icon className="text-sidebar-primary size-4 shrink-0" />
              <span>{benefit.text}</span>
            </li>
          ))}
        </ul>

        <div className="hero-pause-control text-sidebar-foreground/60 flex justify-end text-xs">
          <input id="hero-pause" type="checkbox" className="peer sr-only" />
          <label
            htmlFor="hero-pause"
            className="peer-focus-visible:ring-sidebar-primary hover:text-sidebar-foreground flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 peer-focus-visible:ring-2"
          >
            <span className="hero-pause-on flex items-center gap-1.5">
              <Pause className="size-3.5" /> Pausar animación
            </span>
            <span className="hero-pause-off flex items-center gap-1.5">
              <Play className="size-3.5" /> Reanudar animación
            </span>
          </label>
        </div>
      </div>
    </aside>
  )
}
