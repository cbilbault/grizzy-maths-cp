import type { Exercise } from './types'

export function sameAnswer(expected: Exercise['answer'], given: unknown): boolean {
  if (Array.isArray(expected)) {
    if (!Array.isArray(given) || given.length !== expected.length) return false
    return expected.every((v, i) => Number(v) === Number(given[i]))
  }
  if (typeof expected === 'number') return Number(given) === expected
  return String(given) === String(expected)
}

export function holeResult(ex: {
  a: number | null
  b: number | null
  c: number | null
  op: '+' | '-'
}): number {
  const { a, b, c, op } = ex
  if (c === null) {
    return op === '+' ? (a ?? 0) + (b ?? 0) : (a ?? 0) - (b ?? 0)
  }
  if (a === null) {
    return op === '+' ? c - (b ?? 0) : c + (b ?? 0)
  }
  return op === '+' ? c - (a ?? 0) : (a ?? 0) - c
}

export function compareRelation(left: number, right: number): '<' | '=' | '>' {
  if (left < right) return '<'
  if (left > right) return '>'
  return '='
}

export function compareWord(left: number, right: number): 'moins' | 'autant' | 'plus' {
  if (left < right) return 'moins'
  if (left > right) return 'plus'
  return 'autant'
}
