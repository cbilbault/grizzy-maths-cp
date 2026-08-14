const UNITS = [
  'zéro',
  'un',
  'deux',
  'trois',
  'quatre',
  'cinq',
  'six',
  'sept',
  'huit',
  'neuf',
  'dix',
  'onze',
  'douze',
  'treize',
  'quatorze',
  'quinze',
  'seize',
]

const TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante']

export function numberToFrench(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 100) {
    throw new Error(`Nombre hors champ CP: ${n}`)
  }
  if (n <= 16) return UNITS[n]
  if (n < 20) return `dix-${UNITS[n - 10]}`
  if (n < 70) {
    const tens = Math.floor(n / 10)
    const unit = n % 10
    if (unit === 0) return TENS[tens]
    if (unit === 1) return `${TENS[tens]}-et-un`
    return `${TENS[tens]}-${UNITS[unit]}`
  }
  if (n < 80) {
    if (n === 71) return 'soixante-et-onze'
    return `soixante-${numberToFrench(n - 60)}`
  }
  if (n < 100) {
    if (n === 80) return 'quatre-vingts'
    return `quatre-vingt-${numberToFrench(n - 80)}`
  }
  return 'cent'
}

export const ORDINALS: Record<number, string> = {
  1: 'premier',
  2: 'deuxième',
  3: 'troisième',
  4: 'quatrième',
  5: 'cinquième',
  6: 'sixième',
  7: 'septième',
  8: 'huitième',
  9: 'neuvième',
  10: 'dixième',
  11: 'onzième',
  12: 'douzième',
  13: 'treizième',
  14: 'quatorzième',
  15: 'quinzième',
  16: 'seizième',
  17: 'dix-septième',
  18: 'dix-huitième',
  19: 'dix-neuvième',
  20: 'vingtième',
}
