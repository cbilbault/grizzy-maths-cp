import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { unlockAudio, speak } from '../../audio/tts'
import { SEASON_TITLES } from '../../curriculum/competences'
import { MISSIONS, nextMissionId } from '../../curriculum/missions'
import { useProgress } from '../../state/store'
import { asset } from '../../lib/assets'
import { BigButton, Grizzy, Lemming, Scene } from './ui'

export function Home() {
  const nav = useNavigate()
  const audioOn = useProgress((s) => s.audioOn)
  const pots = useProgress((s) => s.pots)
  const done = useProgress((s) => s.completedMissions)
  const forced = useProgress((s) => s.forcedSeason)
  const nextId = nextMissionId(done)
  const next = MISSIONS.find((m) => m.id === nextId)
  const visibleSeason = forced || next?.season || 1
  const hold = useRef<number | null>(null)

  useEffect(() => {
    speak(
      'Coucou ! Bienvenue dans la cabane de Grizzy et les Lemmings. Choisis la mission du jour, le réveil du frigo, ou le coin libre. On va s’amuser !',
      audioOn,
    )
  }, [audioOn])

  return (
    <Scene room="cabin">
      <header className="flex items-center justify-between p-3">
        <div className="rounded-2xl bg-bark/70 px-3 py-1 text-cream">
          <p className="text-sm uppercase tracking-wide">Grizzy et les Lemmings</p>
          <p className="text-lg font-bold">Maths CP</p>
        </div>
        <div className="pot-pulse flex items-center gap-2 rounded-full bg-cream/90 px-3 py-1 text-xl font-bold">
          <img src={asset('assets/jar.png')} alt="" className="h-8 w-8 idle-hop" />
          {pots}
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-end gap-3 pb-6 sm:flex-row sm:items-end sm:justify-center sm:gap-8">
        <div className="relative">
          <Grizzy className="idle-bob h-36 drop-shadow-xl sm:h-56" />
          <Lemming className="idle-hop absolute -right-4 bottom-4 h-14 w-14" />
          <Lemming className="idle-hop delay absolute -left-3 bottom-8 h-12 w-12" />
        </div>
        <div className="flex w-[min(100%,22rem)] flex-col gap-3 px-4">
          <p className="rounded-2xl bg-cream/90 p-3 text-center text-lg">
            Saison {visibleSeason} — {SEASON_TITLES[visibleSeason as 1 | 2 | 3 | 4 | 5]}
          </p>
          <BigButton
            className="w-full text-2xl"
            onClick={() => {
              unlockAudio()
              if (nextId) nav(`/mission/${nextId}`)
              else nav('/libre')
            }}
          >
            Mission du jour
          </BigButton>
          <BigButton tone="glacier" className="w-full" onClick={() => { unlockAudio(); nav('/rituel') }}>
            Réveil du frigo
          </BigButton>
          <BigButton tone="cream" className="w-full" onClick={() => { unlockAudio(); nav('/libre') }}>
            Coin libre
          </BigButton>
        </div>
      </div>

      <button
        type="button"
        aria-label="Espace parents"
        className="absolute bottom-3 left-3 h-10 w-10 rounded-full bg-bark/50"
        onPointerDown={() => {
          hold.current = window.setTimeout(() => nav('/parents'), 1200)
        }}
        onPointerUp={() => {
          if (hold.current) window.clearTimeout(hold.current)
        }}
      />
    </Scene>
  )
}
