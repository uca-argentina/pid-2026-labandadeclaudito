'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Props = {
  id: string
  name: string
  placeholder?: string
}

// Campo de contraseña con el candado a la izquierda y un ojo a la derecha que
// la muestra u oculta. El ojo que trae Edge se esconde (::-ms-reveal) para que
// no queden dos.
export function InputContrasenia({ id, name, placeholder }: Props) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Lock className="text-muted-foreground absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2" />
      <Input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        className="pr-11 pl-11 [&::-ms-reveal]:hidden"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={visible}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg outline-none focus-visible:ring-3"
      >
        {visible ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
      </button>
    </div>
  )
}
