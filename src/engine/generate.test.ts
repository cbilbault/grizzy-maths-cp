import { describe, expect, it } from 'vitest'
import { generateFromTemplate } from './generate'
import type { ExerciseType } from './types'

const TYPES: ExerciseType[] = [
  'count',
  'build-collection',
  'group-ten',
  'match-reps',
  'compare',
  'number-line',
  'ordinal',
  'write-digits',
  'hole-equality',
  'fluency',
  'procedure-slate',
  'column-add',
  'problem-4ph',
  'share',
  'times-as-add',
  'half-quarter',
  'length',
  'mass',
  'money',
  'clock',
  'shape',
  'grid-draw',
  'solid',
  'move-code',
  'tally-table',
  'bar-chart',
]

describe('generateFromTemplate', () => {
  it('produit un exercice valide pour chaque type', () => {
    for (const type of TYPES) {
      const ex = generateFromTemplate({ type, max: 20, bank: 'p1' }, 'denombre-10', 42, 1)
      expect(ex.type).toBe(type)
      expect(ex.prompt.length).toBeGreaterThan(4)
      expect(ex.answer !== undefined).toBe(true)
    }
  })

  it('reste dans le champ demandé pour le dénombrement', () => {
    for (let i = 0; i < 20; i++) {
      const ex = generateFromTemplate({ type: 'count', max: 8 }, 'denombre-10', 7, i)
      if (ex.type === 'count') expect(ex.count).toBeLessThanOrEqual(8)
    }
  })
})
