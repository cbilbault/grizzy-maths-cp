export type ExerciseType =
  | 'count'
  | 'build-collection'
  | 'group-ten'
  | 'match-reps'
  | 'compare'
  | 'number-line'
  | 'ordinal'
  | 'write-digits'
  | 'hole-equality'
  | 'fluency'
  | 'procedure-slate'
  | 'column-add'
  | 'problem-4ph'
  | 'share'
  | 'times-as-add'
  | 'half-quarter'
  | 'length'
  | 'mass'
  | 'money'
  | 'clock'
  | 'shape'
  | 'grid-draw'
  | 'solid'
  | 'move-code'
  | 'tally-table'
  | 'bar-chart'

export type ItemKind = 'lemming' | 'jar' | 'cube'
export type Scaffold = 'manip' | 'picture' | 'abstract'

export type Room =
  | 'cabin'
  | 'living'
  | 'kitchen'
  | 'attic'
  | 'garden'
  | 'workshop'
  | 'chest'
  | 'clock'
  | 'notebook'

export interface BaseExercise {
  id: string
  type: ExerciseType
  competenceId: string
  prompt: string
  promptShort: string
  storyLine?: string
  answer: number | string | number[]
}

export interface CountEx extends BaseExercise {
  type: 'count'
  count: number
  item: ItemKind
}

export interface BuildEx extends BaseExercise {
  type: 'build-collection'
  target: number
  pool: number
  item: ItemKind
}

export interface GroupTenEx extends BaseExercise {
  type: 'group-ten'
  total: number
}

export interface MatchRepsEx extends BaseExercise {
  type: 'match-reps'
  value: number
}

export interface CompareEx extends BaseExercise {
  type: 'compare'
  left: number
  right: number
  mode: 'words' | 'symbols'
  item: ItemKind
}

export interface NumberLineEx extends BaseExercise {
  type: 'number-line'
  min: number
  max: number
  target: number
}

export interface OrdinalEx extends BaseExercise {
  type: 'ordinal'
  total: number
  rank: number
}

export interface WriteDigitsEx extends BaseExercise {
  type: 'write-digits'
  value: number
  spoken: string
}

export interface HoleEqualityEx extends BaseExercise {
  type: 'hole-equality'
  a: number | null
  b: number | null
  c: number | null
  op: '+' | '-'
}

export interface FluencyEx extends BaseExercise {
  type: 'fluency'
  items: HoleEqualityEx[]
  seconds: number
}

export interface ProcedureSlateEx extends BaseExercise {
  type: 'procedure-slate'
  start: number
  add: number
  steps: string[]
}

export interface ColumnAddEx extends BaseExercise {
  type: 'column-add'
  terms: number[]
}

export interface Problem4phEx extends BaseExercise {
  type: 'problem-4ph'
  story: string
  understandOptions: { id: string; label: string; correct: boolean }[]
  model: {
    kind: 'part-whole'
    left: number | null
    right: number | null
    whole: number | null
    unknown: 'left' | 'right' | 'whole'
  }
  unit: string
  regulationQuestion: string
  regulationYes: boolean
}

export interface ShareEx extends BaseExercise {
  type: 'share'
  total: number
  groups: number
}

export interface TimesAsAddEx extends BaseExercise {
  type: 'times-as-add'
  groups: number
  each: number
}

export interface HalfQuarterEx extends BaseExercise {
  type: 'half-quarter'
  kind: 'moitie' | 'quart'
  whole: number
}

export interface LengthEx extends BaseExercise {
  type: 'length'
  leftCm: number
  rightCm: number
  mode: 'compare' | 'measure'
}

export interface MassEx extends BaseExercise {
  type: 'mass'
  left: number
  right: number
}

export interface MoneyEx extends BaseExercise {
  type: 'money'
  target: number
}

export interface ClockEx extends BaseExercise {
  type: 'clock'
  hour: number
}

export interface ShapeEx extends BaseExercise {
  type: 'shape'
  target: 'carré' | 'rectangle' | 'triangle' | 'cercle'
  options: Array<'carré' | 'rectangle' | 'triangle' | 'cercle'>
}

export interface GridDrawEx extends BaseExercise {
  type: 'grid-draw'
  size: number
  pattern: boolean[]
}

export interface SolidEx extends BaseExercise {
  type: 'solid'
  solid: 'cube' | 'pavé'
  ask: 'faces' | 'sommets'
}

export interface MoveCodeEx extends BaseExercise {
  type: 'move-code'
  cols: number
  rows: number
  start: [number, number]
  goal: [number, number]
  path: Array<'H' | 'B' | 'G' | 'D'>
}

export interface TallyTableEx extends BaseExercise {
  type: 'tally-table'
  counts: number[]
  labels: string[]
  askIndex: number
}

export interface BarChartEx extends BaseExercise {
  type: 'bar-chart'
  values: number[]
  labels: string[]
  mode: 'max' | 'value'
  askIndex?: number
}

export type Exercise =
  | CountEx
  | BuildEx
  | GroupTenEx
  | MatchRepsEx
  | CompareEx
  | NumberLineEx
  | OrdinalEx
  | WriteDigitsEx
  | HoleEqualityEx
  | FluencyEx
  | ProcedureSlateEx
  | ColumnAddEx
  | Problem4phEx
  | ShareEx
  | TimesAsAddEx
  | HalfQuarterEx
  | LengthEx
  | MassEx
  | MoneyEx
  | ClockEx
  | ShapeEx
  | GridDrawEx
  | SolidEx
  | MoveCodeEx
  | TallyTableEx
  | BarChartEx

export interface StepTemplate {
  type: ExerciseType
  max?: number
  min?: number
  bank?: string
  item?: ItemKind
}

export interface Mission {
  id: string
  season: 1 | 2 | 3 | 4 | 5
  room: Room
  title: string
  intro: string
  competenceId: string
  sequence: StepTemplate[]
}

export interface Competence {
  id: string
  season: 1 | 2 | 3 | 4 | 5
  domain: 'nombres' | 'calcul' | 'problemes' | 'grandeurs' | 'espace' | 'donnees'
  label: string
}

export type CompetenceStatus = 'unseen' | 'started' | 'acquired'
