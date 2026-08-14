import { describe, expect, it } from 'vitest'
import { numberToFrench } from './french'
import { holeResult, compareWord, compareRelation } from '../engine/validate'
import { nextScaffold } from '../engine/adaptive'

describe('numberToFrench', () => {
  it('dit les nombres du CP', () => {
    expect(numberToFrench(0)).toBe('zéro')
    expect(numberToFrench(11)).toBe('onze')
    expect(numberToFrench(21)).toBe('vingt-et-un')
    expect(numberToFrench(71)).toBe('soixante-et-onze')
    expect(numberToFrench(80)).toBe('quatre-vingts')
    expect(numberToFrench(91)).toBe('quatre-vingt-onze')
    expect(numberToFrench(100)).toBe('cent')
  })
})

describe('validate', () => {
  it('calcule les égalités à trou', () => {
    expect(holeResult({ a: 4, b: null, c: 10, op: '+' })).toBe(6)
    expect(holeResult({ a: 13, b: 7, c: null, op: '-' })).toBe(6)
  })
  it('compare', () => {
    expect(compareWord(3, 5)).toBe('moins')
    expect(compareRelation(8, 8)).toBe('=')
  })
})

describe('adaptive', () => {
  it('monte et descend l’étayage', () => {
    expect(nextScaffold('manip', 3, 0)).toBe('picture')
    expect(nextScaffold('abstract', 0, 2)).toBe('picture')
  })
})
