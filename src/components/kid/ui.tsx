import type { ReactNode } from 'react'
import { asset } from '../../lib/assets'

export function BigButton({
  children,
  onClick,
  tone = 'honey',
  disabled,
  className = '',
  ariaLabel,
}: {
  children: ReactNode
  onClick?: () => void
  tone?: 'honey' | 'glacier' | 'wood' | 'moss' | 'cream'
  disabled?: boolean
  className?: string
  ariaLabel?: string
}) {
  const tones = {
    honey: 'bg-honey text-bark hover:bg-honey-dark',
    glacier: 'bg-glacier text-white hover:brightness-110',
    wood: 'bg-wood text-cream hover:bg-wood-light',
    moss: 'bg-moss text-white hover:brightness-110',
    cream: 'bg-cream text-bark border-2 border-wood/20 hover:bg-white',
  }
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`min-h-16 min-w-16 rounded-2xl px-5 py-3 text-xl font-semibold shadow-md active:scale-95 disabled:opacity-40 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  )
}

export function NumberPad({
  value,
  onChange,
  onSubmit,
  leftHanded,
  showDisplay = true,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  leftHanded?: boolean
  showDisplay?: boolean
}) {
  const keys = [
    { id: '1', label: '1' },
    { id: '2', label: '2' },
    { id: '3', label: '3' },
    { id: '4', label: '4' },
    { id: '5', label: '5' },
    { id: '6', label: '6' },
    { id: '7', label: '7' },
    { id: '8', label: '8' },
    { id: '9', label: '9' },
    { id: 'back', label: '←' },
    { id: '0', label: '0' },
    { id: 'ok', label: 'OK' },
  ]
  return (
    <div className={`numpad w-full ${leftHanded ? 'order-first' : ''}`}>
      {showDisplay && (
        <div
          aria-live="polite"
          className="numpad-display mb-2 flex min-h-14 items-center justify-center rounded-3xl bg-white text-4xl font-bold tabular-nums text-bark shadow-inner sm:min-h-16 sm:text-5xl"
        >
          {value || '…'}
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {keys.map((k) => (
          <button
            key={k.id}
            type="button"
            aria-label={k.id === 'back' ? 'Effacer' : k.id === 'ok' ? 'Valider' : k.label}
            className={`numpad-key touch-manipulation rounded-2xl font-bold shadow-md active:scale-95 ${
              k.id === 'ok'
                ? 'bg-moss text-white'
                : k.id === 'back'
                  ? 'bg-wood text-cream'
                  : 'bg-white text-bark'
            }`}
            onClick={() => {
              if (k.id === 'back') onChange(value.slice(0, -1))
              else if (k.id === 'ok') onSubmit()
              else if (value.length < 3) onChange(value + k.label)
            }}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function PadScreen({
  children,
  value,
  onChange,
  onSubmit,
  leftHanded,
}: {
  children?: ReactNode
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  leftHanded?: boolean
}) {
  return (
    <div
      className={`flex min-h-0 w-full flex-1 flex-col ${
        leftHanded ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      {children && (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-auto p-3">
          {children}
        </div>
      )}
      <div className="flex w-full shrink-0 justify-center px-3 pb-4 pt-1 md:w-[min(52%,28rem)] md:items-center md:px-3 md:pb-4 md:pt-2">
        <NumberPad value={value} onChange={onChange} onSubmit={onSubmit} leftHanded={leftHanded} />
      </div>
    </div>
  )
}

export function Grizzy({ mood = 'idle', className = '' }: { mood?: 'idle' | 'happy' | 'surprise'; className?: string }) {
  const src =
    mood === 'happy'
      ? asset('assets/grizzy-happy.png')
      : mood === 'surprise'
        ? asset('assets/grizzy-surprise.png')
        : asset('assets/grizzy.png')
  return <img src={src} alt="Grizzy" className={`pointer-events-none object-contain ${className}`} />
}

export function Lemming({ className = '', jar = false, onClick }: { className?: string; jar?: boolean; onClick?: () => void }) {
  const src = jar ? asset('assets/lemming-jar.png') : asset('assets/lemming.png')
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="p-0">
        <img src={src} alt="Lemming" className={`object-contain ${className}`} />
      </button>
    )
  }
  return <img src={src} alt="" className={`pointer-events-none object-contain ${className}`} />
}

export function Jar({ className = '', onClick }: { className?: string; onClick?: () => void }) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="p-0">
        <img src={asset('assets/jar.png')} alt="pot" className={`object-contain ${className}`} />
      </button>
    )
  }
  return <img src={asset('assets/jar.png')} alt="" className={`pointer-events-none object-contain ${className}`} />
}

export function Cube({ className = '', onClick, marked }: { className?: string; onClick?: () => void; marked?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 w-11 rounded-md border-2 border-wood shadow ${marked ? 'bg-honey' : 'bg-glacier'} ${className}`}
    />
  )
}

const ROOMS: Record<string, string> = {
  cabin: asset('assets/cabin-exterior.jpg'),
  living: asset('assets/living.jpg'),
  kitchen: asset('assets/kitchen.jpg'),
  attic: asset('assets/attic.jpg'),
  garden: asset('assets/garden.jpg'),
  workshop: asset('assets/workshop.jpg'),
  chest: asset('assets/attic.jpg'),
  clock: asset('assets/clock.jpg'),
  notebook: asset('assets/living.jpg'),
}

export function Scene({
  room,
  children,
  dim,
}: {
  room: string
  children?: ReactNode
  dim?: boolean
}) {
  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${ROOMS[room] ?? ROOMS.cabin})` }}
    >
      {dim && <div className="absolute inset-0 bg-bark/35" />}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}

export function Items({
  kind,
  n,
  marked,
  onTap,
}: {
  kind: 'lemming' | 'jar' | 'cube'
  n: number
  marked?: boolean[]
  onTap?: (i: number) => void
}) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-1">
      {Array.from({ length: n }, (_, i) => {
        const done = marked?.[i]
        if (kind === 'cube') {
          return <Cube key={i} marked={done} onClick={onTap ? () => onTap(i) : undefined} />
        }
        if (kind === 'jar') {
          return (
            <Jar
              key={i}
              className={`h-16 w-16 ${done ? 'opacity-40' : 'sprite-pop'}`}
              onClick={onTap ? () => onTap(i) : undefined}
            />
          )
        }
        return (
          <Lemming
            key={i}
            className={`h-20 w-20 ${done ? 'scale-90 opacity-50' : 'sprite-pop'}`}
            onClick={onTap ? () => onTap(i) : undefined}
          />
        )
      })}
    </div>
  )
}
