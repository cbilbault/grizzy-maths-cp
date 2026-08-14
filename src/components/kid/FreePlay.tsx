import { useNavigate } from 'react-router-dom'
import { SEASON_TITLES } from '../../curriculum/competences'
import { MISSIONS } from '../../curriculum/missions'
import { useProgress } from '../../state/store'
import { BigButton, Scene } from './ui'

const ROOMS = [
  { id: 'kitchen', label: 'Cuisine / frigo' },
  { id: 'living', label: 'Salon / télé' },
  { id: 'attic', label: 'Grenier' },
  { id: 'garden', label: 'Jardin' },
  { id: 'workshop', label: 'Atelier' },
  { id: 'chest', label: 'Coffre' },
  { id: 'clock', label: 'Horloge' },
  { id: 'notebook', label: 'Carnet' },
] as const

export function FreePlay() {
  const nav = useNavigate()
  const done = useProgress((s) => s.completedMissions)
  const forced = useProgress((s) => s.forcedSeason)
  const unlockedSeason = forced || Math.max(1, ...MISSIONS.filter((m) => done.includes(m.id)).map((m) => m.season), 1)

  return (
    <Scene room="cabin" dim>
      <div className="flex items-center justify-between p-3">
        <button type="button" className="rounded-full bg-cream px-3 py-2" onClick={() => nav('/')}>
          ←
        </button>
        <h1 className="rounded-full bg-bark/70 px-4 py-1 text-cream">Coin libre</h1>
        <span />
      </div>
      <div className="grid flex-1 grid-cols-2 gap-3 overflow-auto p-3 sm:grid-cols-4">
        {ROOMS.map((r) => {
          const missions = MISSIONS.filter((m) => m.room === r.id && m.season <= unlockedSeason)
          return (
            <div key={r.id} className="flex flex-col gap-2 rounded-2xl bg-cream/90 p-3">
              <p className="font-bold">{r.label}</p>
              {missions.map((m) => (
                <BigButton
                  key={m.id}
                  tone={done.includes(m.id) ? 'moss' : 'honey'}
                  className="w-full text-base"
                  onClick={() => nav(`/mission/${m.id}`)}
                >
                  {m.title}
                </BigButton>
              ))}
              {missions.length === 0 && <p className="text-sm text-wood">Bientôt…</p>}
            </div>
          )
        })}
      </div>
      <p className="px-4 pb-3 text-center text-sm text-cream">
        Saisons ouvertes jusqu’à {unlockedSeason} — {SEASON_TITLES[unlockedSeason as 1 | 2 | 3 | 4 | 5]}
      </p>
    </Scene>
  )
}
