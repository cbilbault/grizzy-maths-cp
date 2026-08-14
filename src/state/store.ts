import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nextScaffold } from '../engine/adaptive'
import type { CompetenceStatus, Scaffold } from '../engine/types'
import { COMPETENCES } from '../curriculum/competences'
import { MISSIONS } from '../curriculum/missions'

export interface FluencyPoint {
  at: number
  correct: number
  total: number
  seconds: number
}

interface ProgressState {
  childName: string
  completedMissions: string[]
  competence: Record<string, CompetenceStatus>
  pots: number
  problemsThisWeek: { week: string; count: number }
  fluency: FluencyPoint[]
  scaffold: Scaffold
  streakOk: number
  streakKo: number
  audioOn: boolean
  reduceMotion: boolean
  videosOn: boolean
  voiceName: string
  leftHanded: boolean
  dailyLimitMin: number
  secondsToday: { day: string; seconds: number }
  forcedSeason: 0 | 1 | 2 | 3 | 4 | 5
  parentUnlocked: boolean
  setName: (name: string) => void
  completeMission: (id: string) => void
  markCompetence: (id: string, status: CompetenceStatus) => void
  addPots: (n: number) => void
  addProblem: () => void
  addFluency: (point: FluencyPoint) => void
  recordAnswer: (ok: boolean) => void
  toggleAudio: () => void
  toggleMotion: () => void
  toggleVideos: () => void
  setVoiceName: (name: string) => void
  toggleHand: () => void
  setLimit: (min: number) => void
  addSeconds: (s: number) => void
  setSeason: (s: 0 | 1 | 2 | 3 | 4 | 5) => void
  setParent: (v: boolean) => void
  resetAll: () => void
}

function weekKey(d = new Date()): string {
  const onejan = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${week}`
}

function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}

const emptyCompetence = (): Record<string, CompetenceStatus> =>
  Object.fromEntries(COMPETENCES.map((c) => [c.id, 'unseen' as CompetenceStatus]))

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      childName: '',
      completedMissions: [],
      competence: emptyCompetence(),
      pots: 0,
      problemsThisWeek: { week: weekKey(), count: 0 },
      fluency: [],
      scaffold: 'manip',
      streakOk: 0,
      streakKo: 0,
      audioOn: true,
      reduceMotion: false,
      videosOn: true,
      voiceName: '',
      leftHanded: false,
      dailyLimitMin: 25,
      secondsToday: { day: dayKey(), seconds: 0 },
      forcedSeason: 0,
      parentUnlocked: false,
      setName: (childName) => set({ childName }),
      completeMission: (id) => {
        const done = get().completedMissions
        if (done.includes(id)) return
        const mission = MISSIONS.find((m) => m.id === id)
        set({
          completedMissions: [...done, id],
          pots: get().pots + 3,
        })
        if (mission) {
          get().markCompetence(mission.competenceId, 'acquired')
        }
      },
      markCompetence: (id, status) =>
        set({ competence: { ...get().competence, [id]: status } }),
      addPots: (n) => set({ pots: get().pots + n }),
      addProblem: () => {
        const w = weekKey()
        const cur = get().problemsThisWeek
        set({
          problemsThisWeek:
            cur.week === w ? { week: w, count: cur.count + 1 } : { week: w, count: 1 },
        })
      },
      addFluency: (point) => set({ fluency: [...get().fluency.slice(-40), point] }),
      recordAnswer: (ok) => {
        const streakOk = ok ? get().streakOk + 1 : 0
        const streakKo = ok ? 0 : get().streakKo + 1
        set({
          streakOk,
          streakKo,
          scaffold: nextScaffold(get().scaffold, streakOk, streakKo),
        })
      },
      toggleAudio: () => set({ audioOn: !get().audioOn }),
      toggleMotion: () => set({ reduceMotion: !get().reduceMotion }),
      toggleVideos: () => set({ videosOn: !get().videosOn }),
      setVoiceName: (voiceName) => set({ voiceName }),
      toggleHand: () => set({ leftHanded: !get().leftHanded }),
      setLimit: (dailyLimitMin) => set({ dailyLimitMin }),
      addSeconds: (s) => {
        const day = dayKey()
        const cur = get().secondsToday
        set({
          secondsToday:
            cur.day === day
              ? { day, seconds: cur.seconds + s }
              : { day, seconds: s },
        })
      },
      setSeason: (forcedSeason) => set({ forcedSeason }),
      setParent: (parentUnlocked) => set({ parentUnlocked }),
      resetAll: () =>
        set({
          completedMissions: [],
          competence: emptyCompetence(),
          pots: 0,
          problemsThisWeek: { week: weekKey(), count: 0 },
          fluency: [],
          scaffold: 'manip',
          streakOk: 0,
          streakKo: 0,
          secondsToday: { day: dayKey(), seconds: 0 },
        }),
    }),
    { name: 'grizzy-maths-cp' },
  ),
)
