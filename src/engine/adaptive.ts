import type { Scaffold } from './types'

export function nextScaffold(
  current: Scaffold,
  streakOk: number,
  streakKo: number,
): Scaffold {
  if (streakOk >= 3) {
    if (current === 'manip') return 'picture'
    if (current === 'picture') return 'abstract'
    return 'abstract'
  }
  if (streakKo >= 2) {
    if (current === 'abstract') return 'picture'
    return 'manip'
  }
  return current
}

export const SCAFFOLD_LABEL: Record<Scaffold, string> = {
  manip: 'On touche les Lemmings',
  picture: 'On regarde le dessin',
  abstract: 'On écrit les nombres',
}
