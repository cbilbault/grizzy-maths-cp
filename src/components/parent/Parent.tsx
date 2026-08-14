import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { COMPETENCES, SEASON_TITLES } from '../../curriculum/competences'
import { MISSIONS } from '../../curriculum/missions'
import { useProgress } from '../../state/store'

const STATUS: Record<string, string> = {
  unseen: 'Non vu',
  started: 'En cours',
  acquired: 'Acquis',
}

export function Parent() {
  const nav = useNavigate()
  const s = useProgress()
  const weekCount = s.problemsThisWeek.count
  const minutes = Math.round(s.secondsToday.seconds / 60)

  const bySeason = useMemo(() => {
    return ([1, 2, 3, 4, 5] as const).map((season) => ({
      season,
      items: COMPETENCES.filter((c) => c.season === season),
    }))
  }, [])

  const exportBilan = () => {
    const lines = [
      'Grizzy et les Lemmings — Maths CP',
      `Pots : ${s.pots}`,
      `Missions : ${s.completedMissions.length} / ${MISSIONS.length}`,
      `Problèmes cette semaine : ${weekCount} / 10`,
      '',
      ...COMPETENCES.map((c) => `${c.label} : ${STATUS[s.competence[c.id] ?? 'unseen']}`),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'bilan-grizzy-maths-cp.txt'
    a.click()
  }

  return (
    <div className="min-h-full overflow-auto bg-cream p-4 text-bark">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <button type="button" className="rounded-full bg-wood px-4 py-2 text-cream" onClick={() => nav('/')}>
            Retour
          </button>
          <h1 className="text-2xl font-bold">Espace parents</h1>
        </div>

        <p className="mt-3 rounded-xl bg-wood/10 p-3 text-sm">
          Jeu éducatif <strong>non officiel</strong>, sans lien avec Studio Hari. Usage familial. Personnages et
          storytelling : Grizzy et les Lemmings.
        </p>

        <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Pots" value={String(s.pots)} />
          <Stat label="Missions" value={`${s.completedMissions.length}/${MISSIONS.length}`} />
          <Stat label="Problèmes / sem." value={`${weekCount}/10`} />
          <Stat label="Aujourd’hui" value={`${minutes} min`} />
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-bold">Compétences (programme CP 2025)</h2>
          {bySeason.map(({ season, items }) => (
            <div key={season} className="mt-3">
              <h3 className="font-semibold">
                Saison {season} — {SEASON_TITLES[season]}
              </h3>
              <ul className="mt-1 divide-y divide-wood/10 rounded-xl bg-white">
                {items.map((c) => (
                  <li key={c.id} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span>{c.label}</span>
                    <span
                      className={
                        s.competence[c.id] === 'acquired'
                          ? 'text-moss'
                          : s.competence[c.id] === 'started'
                            ? 'text-honey-dark'
                            : 'text-wood/50'
                      }
                    >
                      {STATUS[s.competence[c.id] ?? 'unseen']}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-bold">Fluence</h2>
          {s.fluency.length === 0 ? (
            <p className="text-sm">Pas encore de défi télé.</p>
          ) : (
            <ul className="text-sm">
              {s.fluency.slice(-8).map((f) => (
                <li key={f.at}>
                  {new Date(f.at).toLocaleDateString('fr-FR')} : {f.correct}/{f.total} en {f.seconds}s
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-6 space-y-3">
          <h2 className="text-xl font-bold">Réglages</h2>
          <label className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
            Audio
            <input type="checkbox" checked={s.audioOn} onChange={s.toggleAudio} />
          </label>
          <label className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
            Moins d’animations
            <input type="checkbox" checked={s.reduceMotion} onChange={s.toggleMotion} />
          </label>
          <label className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
            Petites vidéos-récompenses
            <input type="checkbox" checked={s.videosOn} onChange={s.toggleVideos} />
          </label>
          <label className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
            Gaucher (pavé à gauche)
            <input type="checkbox" checked={s.leftHanded} onChange={s.toggleHand} />
          </label>
          <label className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
            Limite quotidienne (min)
            <input
              type="number"
              className="w-20 rounded border px-2"
              value={s.dailyLimitMin}
              onChange={(e) => s.setLimit(Number(e.target.value) || 0)}
            />
          </label>
          <label className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
            Forcer la saison scolaire
            <select
              className="rounded border px-2"
              value={s.forcedSeason}
              onChange={(e) => s.setSeason(Number(e.target.value) as 0 | 1 | 2 | 3 | 4 | 5)}
            >
              <option value={0}>Automatique</option>
              <option value={1}>P1</option>
              <option value={2}>P2</option>
              <option value={3}>P3</option>
              <option value={4}>P4</option>
              <option value={5}>P5</option>
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-xl bg-wood px-4 py-2 text-cream" onClick={exportBilan}>
              Exporter le bilan
            </button>
            <button
              type="button"
              className="rounded-xl bg-red-800 px-4 py-2 text-white"
              onClick={() => {
                if (confirm('Remettre toute la progression à zéro ?')) s.resetAll()
              }}
            >
              Réinitialiser
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3">
      <p className="text-xs uppercase text-wood/70">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
