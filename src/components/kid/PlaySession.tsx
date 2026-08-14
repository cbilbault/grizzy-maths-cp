import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { speak, stopSpeak, unlockAudio } from '../../audio/tts'
import { MISSIONS } from '../../curriculum/missions'
import { generateFromTemplate } from '../../engine/generate'
import type { Exercise, Room } from '../../engine/types'
import { useProgress } from '../../state/store'
import { ExerciseView } from '../exercises/ExerciseView'
import { BigButton, Grizzy, Scene } from './ui'

export function MissionPlay() {
  const { id } = useParams()
  const mission = MISSIONS.find((m) => m.id === id)
  if (!mission) return <p className="p-6 text-cream">Mission introuvable</p>
  return (
    <PlaySession
      room={mission.room}
      title={mission.title}
      intro={mission.intro}
      exercises={buildExercises(mission.id, mission.competenceId, mission.sequence)}
      competenceId={mission.competenceId}
      onDone={() => useProgress.getState().completeMission(mission.id)}
    />
  )
}

export function RitualPlay() {
  const season = useProgress((s) => s.forcedSeason) || inferSeason()
  const max = season === 1 ? 10 : season === 2 ? 20 : 100
  const sequence = [
    { type: 'hole-equality' as const, max },
    { type: 'hole-equality' as const, max },
    { type: 'write-digits' as const, max },
    { type: 'compare' as const, max },
    { type: 'hole-equality' as const, max },
  ]
  const day = new Date().toISOString().slice(0, 10)
  return (
    <PlaySession
      room="living"
      title="Réveil du frigo"
      intro="Trois minutes avec Grizzy : le frigo ne s’ouvre que si tu calcules."
      exercises={buildExercises(`rituel-${day}`, 'add-mentale', sequence)}
      competenceId="add-mentale"
    />
  )
}

function inferSeason(): 1 | 2 | 3 | 4 | 5 {
  const done = useProgress.getState().completedMissions
  const last = [...MISSIONS].reverse().find((m) => done.includes(m.id))
  return last?.season ?? 1
}

function buildExercises(
  seedKey: string,
  competenceId: string,
  sequence: { type: import('../../engine/types').ExerciseType; max?: number; min?: number; bank?: string }[],
): Exercise[] {
  let seed = 0
  for (let i = 0; i < seedKey.length; i++) seed = (seed * 31 + seedKey.charCodeAt(i)) >>> 0
  return sequence.map((step, i) => generateFromTemplate(step, competenceId, seed, i))
}

function PlaySession({
  room,
  title,
  intro,
  exercises,
  competenceId,
  onDone,
}: {
  room: Room
  title: string
  intro: string
  exercises: Exercise[]
  competenceId: string
  onDone?: () => void
}) {
  const nav = useNavigate()
  const audioOn = useProgress((s) => s.audioOn)
  const scaffold = useProgress((s) => s.scaffold)
  const left = useProgress((s) => s.leftHanded)
  const record = useProgress((s) => s.recordAnswer)
  const addPots = useProgress((s) => s.addPots)
  const mark = useProgress((s) => s.markCompetence)
  const addProblem = useProgress((s) => s.addProblem)
  const addSeconds = useProgress((s) => s.addSeconds)
  const [phase, setPhase] = useState<'intro' | 'play' | 'feedback' | 'end'>('intro')
  const [i, setI] = useState(0)
  const [ok, setOk] = useState<boolean | null>(null)
  const [mood, setMood] = useState<'idle' | 'happy' | 'surprise'>('idle')
  const ex = exercises[i]

  useEffect(() => {
    mark(competenceId, 'started')
    unlockAudio()
    const t = setInterval(() => addSeconds(5), 5000)
    return () => {
      clearInterval(t)
      stopSpeak()
    }
  }, [addSeconds, competenceId, mark])

  useEffect(() => {
    if (phase === 'intro') speak(intro, audioOn)
    if (phase === 'play' && ex) speak(ex.prompt, audioOn)
  }, [phase, ex, intro, audioOn])

  const progress = useMemo(() => `${i + 1} / ${exercises.length}`, [i, exercises.length])

  const nextAfterFeedback = () => {
    if (i + 1 >= exercises.length) {
      onDone?.()
      setPhase('end')
      speak('Bravo ! Grizzy récupère son canapé. Les Lemmings sont rangés.', audioOn)
    } else {
      setI((n) => n + 1)
      setOk(null)
      setMood('idle')
      setPhase('play')
    }
  }

  return (
    <Scene room={room} dim>
      <header className="flex items-center justify-between p-3">
        <button type="button" className="rounded-full bg-cream/90 px-3 py-2" onClick={() => nav('/')}>
          ←
        </button>
        <p className="rounded-full bg-bark/70 px-3 py-1 text-cream">{title} · {progress}</p>
        <button
          type="button"
          className="rounded-full bg-cream/90 px-3 py-2"
          onClick={() => speak(phase === 'intro' ? intro : ex?.prompt ?? '', audioOn)}
        >
          🔊
        </button>
      </header>

      {phase === 'intro' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
          <Grizzy mood="surprise" className="h-44" />
          <p className="max-w-lg rounded-3xl bg-cream/95 p-4 text-center text-xl">{intro}</p>
          <BigButton
            className="text-2xl"
            onClick={() => {
              unlockAudio()
              setPhase('play')
            }}
          >
            C’est parti
          </BigButton>
        </div>
      )}

      {phase === 'play' && ex && (
        <div className="flex min-h-0 flex-1 flex-col">
        <p className="mx-auto max-w-xl rounded-2xl bg-cream/95 px-4 py-2 text-center text-lg font-semibold text-bark">
          {ex.promptShort}
        </p>
        <div className="mx-auto mb-3 flex min-h-0 w-[min(100%-1.5rem,52rem)] flex-1 overflow-auto rounded-3xl bg-cream/90 shadow-xl">
        <ExerciseView
          key={ex.id}
          ex={ex}
          scaffold={scaffold}
          leftHanded={left}
          onResult={(good) => {
            record(good)
            setOk(good)
            setMood(good ? 'happy' : 'surprise')
            if (good) addPots(1)
            if (ex.type === 'problem-4ph') addProblem()
            speak(good ? 'Oui ! Les Lemmings sont rangés.' : 'On recommence ensemble.', audioOn)
            setPhase('feedback')
          }}
        />
        </div>
        </div>
      )}

      {phase === 'feedback' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
          <Grizzy mood={mood} className={`h-44 ${ok ? '' : 'shake'}`} />
          <p className="rounded-3xl bg-cream/95 px-6 py-3 text-2xl">{ok ? 'Bravo !' : 'On réessaie.'}</p>
          <BigButton
            onClick={() => {
              if (ok) nextAfterFeedback()
              else {
                setOk(null)
                setMood('idle')
                setPhase('play')
              }
            }}
          >
            {ok ? 'La suite' : 'Réessayer'}
          </BigButton>
        </div>
      )}

      {phase === 'end' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
          <Grizzy mood="happy" className="h-52" />
          <p className="rounded-3xl bg-cream/95 p-4 text-center text-2xl">
            Grizzy récupère le canapé. Trois pots de tartinade pour toi !
          </p>
          <BigButton onClick={() => nav('/')}>Retour à la cabane</BigButton>
        </div>
      )}
    </Scene>
  )
}
