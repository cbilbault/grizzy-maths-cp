import { useEffect, useState } from 'react'
import { speak } from '../../audio/tts'
import type { RewardClip } from '../../story/rewards'
import { BigButton } from './ui'

export function RewardShow({
  clip,
  audioOn,
  onDone,
}: {
  clip: RewardClip
  audioOn: boolean
  onDone: () => void
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    speak(clip.line, audioOn)
    const unlock = window.setTimeout(() => setReady(true), 800)
    return () => window.clearTimeout(unlock)
  }, [clip, audioOn])

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-bark/80">
      <div className="relative mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col justify-center p-3">
        <p className="mb-2 self-center rounded-full bg-honey px-4 py-1 text-lg font-bold text-bark">
          Récompense !
        </p>
        <video
          className="max-h-[70vh] w-full rounded-3xl bg-black object-contain shadow-2xl"
          src={clip.src}
          poster={clip.poster}
          autoPlay
          muted
          playsInline
          onEnded={onDone}
        />
        <p className="mt-3 text-center text-xl font-semibold text-cream">{clip.line}</p>
        {ready && (
          <div className="mt-3 flex justify-center">
            <BigButton onClick={onDone}>Continuer</BigButton>
          </div>
        )}
      </div>
    </div>
  )
}

export function JarRain({ count = 10 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <img
          key={i}
          src={clipJar()}
          alt=""
          className="jar-fall absolute w-10"
          style={{
            left: `${8 + ((i * 17) % 84)}%`,
            animationDelay: `${i * 0.08}s`,
            animationDuration: `${1.1 + (i % 4) * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}

function clipJar() {
  return `${import.meta.env.BASE_URL}assets/jar.png`
}
