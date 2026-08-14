import { numberToFrench, ORDINALS } from '../lib/french'
import { mulberry32, pick, randInt, shuffle } from '../lib/rng'
import { holeResult } from './validate'
import type {
  Exercise,
  ExerciseType,
  HalfQuarterEx,
  HoleEqualityEx,
  ItemKind,
  Problem4phEx,
  StepTemplate,
} from './types'
import { PROBLEM_BANK } from '../curriculum/problems'

const ITEMS: ItemKind[] = ['lemming', 'jar', 'cube']

function itemName(item: ItemKind, n: number): string {
  if (item === 'lemming') return n > 1 ? 'Lemmings' : 'Lemming'
  if (item === 'jar') return n > 1 ? 'pots de tartinade' : 'pot de tartinade'
  return n > 1 ? 'cubes' : 'cube'
}

function holeEx(
  id: string,
  competenceId: string,
  a: number | null,
  b: number | null,
  c: number | null,
  op: '+' | '-',
): HoleEqualityEx {
  const answer = holeResult({ a, b, c, op })
  const left = `${a ?? '□'} ${op} ${b ?? '□'}`
  const promptShort = `${left} = ${c ?? '□'}`
  return {
    id,
    type: 'hole-equality',
    competenceId,
    a,
    b,
    c,
    op,
    answer,
    promptShort,
    prompt: `Combien faut-il écrire à la place du carré ? ${promptShort.replace('□', 'carré')}`,
  }
}

export function generateFromTemplate(
  template: StepTemplate,
  competenceId: string,
  seed: number,
  index: number,
): Exercise {
  const rng = mulberry32(seed + index * 9973)
  const max = template.max ?? 10
  const min = template.min ?? 1
  const id = `ex-${seed}-${index}`
  return build(template.type, id, competenceId, rng, min, max, template.bank, template.item)
}

function build(
  type: ExerciseType,
  id: string,
  competenceId: string,
  rng: () => number,
  min: number,
  max: number,
  bank?: string,
  forcedItem?: ItemKind,
): Exercise {
  const item = forcedItem ?? (type === 'count' || type === 'build-collection' || type === 'compare' ? 'lemming' : pick(rng, ITEMS))

  switch (type) {
    case 'count': {
      const count = randInt(rng, Math.max(1, min), Math.min(max, 12))
      return {
        id,
        type,
        competenceId,
        count,
        item,
        answer: count,
        promptShort: 'Combien ?',
        prompt: `Touche chaque ${itemName(item, 1)} pour compter. Combien y en a-t-il ?`,
        storyLine: 'Les Lemmings ont envahi le frigo de Grizzy !',
      }
    }
    case 'build-collection': {
      const target = randInt(rng, Math.max(1, min), Math.min(max, 12))
      return {
        id,
        type,
        competenceId,
        target,
        pool: target + randInt(rng, 2, 5),
        item,
        answer: target,
        promptShort: `Donne ${target}`,
        prompt: `Grizzy veut ${target} ${itemName(item, target)}. Donne-les-lui.`,
      }
    }
    case 'group-ten': {
      const tens = randInt(rng, 1, Math.min(5, Math.floor(max / 10) || 2))
      const units = randInt(rng, 0, 9)
      const total = Math.min(max, tens * 10 + units)
      return {
        id,
        type,
        competenceId,
        total,
        answer: total,
        promptShort: 'Range par 10',
        prompt: `Range les Lemmings dans des caisses de dix. Combien y en a-t-il en tout ?`,
      }
    }
    case 'match-reps': {
      const tens = randInt(rng, 1, Math.min(5, Math.floor(max / 10) || 3))
      const units = randInt(rng, 0, 9)
      const value = Math.min(max, tens * 10 + units)
      return {
        id,
        type,
        competenceId,
        value,
        answer: value,
        promptShort: String(value),
        prompt: `Trouve la carte qui montre le même nombre : ${numberToFrench(value)}.`,
      }
    }
    case 'compare': {
      const left = randInt(rng, min, max)
      let right = randInt(rng, min, max)
      if (rng() < 0.2) right = left
      const mode = max <= 10 ? 'words' : rng() < 0.5 ? 'words' : 'symbols'
      const word =
        left === right ? 'autant' : left > right ? 'plus' : 'moins'
      return {
        id,
        type,
        competenceId,
        left,
        right,
        mode,
        item,
        answer: mode === 'words' ? word : left === right ? '=' : left > right ? '>' : '<',
        promptShort: 'Compare',
        prompt:
          mode === 'words'
            ? 'À gauche, y a-t-il plus, moins, ou autant qu’à droite ?'
            : 'Choisis le bon signe entre les deux nombres.',
      }
    }
    case 'number-line': {
      const lineMax = max <= 20 ? max : Math.min(max, 20)
      const target = randInt(rng, 0, lineMax)
      return {
        id,
        type,
        competenceId,
        min: 0,
        max: lineMax,
        target,
        answer: target,
        promptShort: `Place ${target}`,
        prompt: `Place le Lemming sur le nombre ${numberToFrench(target)}.`,
      }
    }
    case 'ordinal': {
      const total = randInt(rng, 5, Math.min(10, max || 10))
      const rank = randInt(rng, 1, total)
      return {
        id,
        type,
        competenceId,
        total,
        rank,
        answer: rank,
        promptShort: ORDINALS[rank],
        prompt: `Touche le ${ORDINALS[rank]} Lemming, en partant de la gauche.`,
      }
    }
    case 'write-digits': {
      const value = randInt(rng, min === 0 ? 0 : Math.max(0, min), max)
      const spoken = numberToFrench(value)
      return {
        id,
        type,
        competenceId,
        value,
        spoken,
        answer: value,
        promptShort: 'Écris',
        prompt: `Écris le nombre ${spoken}.`,
      }
    }
    case 'hole-equality': {
      const op: '+' | '-' = competenceId.includes('cassage') || competenceId.includes('moins') ? '-' : '+'
      if (op === '+') {
        const a = randInt(rng, 0, Math.min(10, max))
        const b = randInt(rng, 0, Math.min(10, max - a))
        const hole = pick(rng, ['c', 'b', 'a'] as const)
        return holeEx(
          id,
          competenceId,
          hole === 'a' ? null : a,
          hole === 'b' ? null : b,
          hole === 'c' ? null : a + b,
          '+',
        )
      }
      const c = randInt(rng, 4, Math.min(20, max))
      const b = randInt(rng, 1, Math.min(9, c))
      return holeEx(id, competenceId, c, null, c - b, '-')
    }
    case 'fluency': {
      const items = Array.from({ length: 8 }, (_, i) => {
        const a = randInt(rng, 0, 10)
        const b = randInt(rng, 0, 10)
        return holeEx(`${id}-${i}`, competenceId, a, b, null, '+')
      })
      return {
        id,
        type,
        competenceId,
        items,
        seconds: 60,
        answer: items.length,
        promptShort: 'Défi télé',
        prompt: 'Complète le plus d’égalités possible. Grizzy garde la télé allumée une minute !',
      }
    }
    case 'procedure-slate': {
      const start = randInt(rng, 21, Math.min(89, max - 9))
      const add = competenceId === 'plus9' ? 9 : randInt(rng, 3, 8)
      const toTen = 10 - (start % 10)
      const rest = add - toTen
      const mid = start + toTen
      const result = start + add
      const steps =
        start % 10 + add >= 10 && add !== 9
          ? [
              `${start} plus ${add}.`,
              `D’abord, on va à la dizaine : ${start} plus ${toTen} égale ${mid}.`,
              `Il reste ${rest} à ajouter. ${mid} plus ${rest} égale ${result}.`,
            ]
          : add === 9
            ? [
                `Pour ajouter 9, on ajoute 10 puis on retire 1.`,
                `${start} plus 10 égale ${start + 10}.`,
                `${start + 10} moins 1 égale ${result}.`,
              ]
            : [
                `${start} plus ${add}.`,
                `On ajoute les unités : ${start % 10} plus ${add} égale ${(start % 10) + add}.`,
                `Le résultat est ${result}.`,
              ]
      return {
        id,
        type,
        competenceId,
        start,
        add,
        steps,
        answer: result,
        promptShort: `${start} + ${add}`,
        prompt: `Calcule ${start} plus ${add}. Suis l’ardoise de Grizzy.`,
      }
    }
    case 'column-add': {
      const a = randInt(rng, 12, 48)
      const b = randInt(rng, 11, 47)
      return {
        id,
        type,
        competenceId,
        terms: [a, b],
        answer: a + b,
        promptShort: `${a} + ${b}`,
        prompt: `Pose l’addition. Les unités sous les unités, les dizaines sous les dizaines.`,
      }
    }
    case 'problem-4ph':
      return makeProblem(id, competenceId, rng, bank ?? 'p1', max)
    case 'share': {
      const groups = pick(rng, [2, 3, 4])
      const each = randInt(rng, 2, Math.min(6, Math.floor(max / groups)))
      const total = groups * each
      return {
        id,
        type,
        competenceId,
        total,
        groups,
        answer: each,
        promptShort: 'Partage',
        prompt: `${total} pots pour ${groups} Lemmings, tous pareil. Combien chacun ?`,
      }
    }
    case 'times-as-add': {
      const groups = randInt(rng, 2, 4)
      const each = randInt(rng, 2, 7)
      return {
        id,
        type,
        competenceId,
        groups,
        each,
        answer: groups * each,
        promptShort: `${groups} fois ${each}`,
        prompt: `${groups} boîtes de ${each} noisettes. Combien en tout ? C’est ${groups} fois ${each}.`,
      }
    }
    case 'half-quarter': {
      const kind = (competenceId.includes('quart') && rng() < 0.4 ? 'quart' : 'moitie') as HalfQuarterEx['kind']
      const whole = kind === 'quart' ? pick(rng, [4, 8, 12, 16, 20]) : pick(rng, [2, 4, 6, 8, 10, 12, 16, 20])
      const answer = kind === 'quart' ? whole / 4 : whole / 2
      return {
        id,
        type,
        competenceId,
        kind,
        whole,
        answer,
        promptShort: kind === 'quart' ? 'Un quart' : 'La moitié',
        prompt:
          kind === 'quart'
            ? `Grizzy coupe le gâteau en quatre parts égales. Un quart de ${whole}, c’est combien ?`
            : `Quelle est la moitié de ${whole} ?`,
      }
    }
    case 'length': {
      const leftCm = randInt(rng, 2, 9)
      let rightCm = randInt(rng, 2, 9)
      if (rng() < 0.15) rightCm = leftCm
      const mode = competenceId.includes('mesure') ? 'measure' : 'compare'
      return {
        id,
        type,
        competenceId,
        leftCm,
        rightCm,
        mode,
        answer: mode === 'measure' ? leftCm : leftCm === rightCm ? 0 : leftCm > rightCm ? 1 : 2,
        promptShort: mode === 'measure' ? 'Mesure' : 'Plus long ?',
        prompt:
          mode === 'measure'
            ? 'Combien de centimètres mesure le câble de la télé ?'
            : 'Quel câble est le plus long ? Touche-le. S’ils sont pareils, touche les deux mots « autant ».',
      }
    }
    case 'mass': {
      const left = randInt(rng, 1, 8)
      let right = randInt(rng, 1, 8)
      if (rng() < 0.2) right = left
      return {
        id,
        type,
        competenceId,
        left,
        right,
        answer: left === right ? 0 : left > right ? 1 : 2,
        promptShort: 'Plus lourd ?',
        prompt: 'Quel plateau est le plus lourd ?',
      }
    }
    case 'money': {
      const target = pick(rng, [3, 4, 5, 6, 7, 8, 10, 12, 15, 20].filter((n) => n <= Math.max(max, 5)))
      return {
        id,
        type,
        competenceId,
        target,
        answer: target,
        promptShort: `${target} €`,
        prompt: `Compose ${target} euros avec les pièces et les billets de Grizzy.`,
      }
    }
    case 'clock': {
      const hour = randInt(rng, 1, 12)
      return {
        id,
        type,
        competenceId,
        hour,
        answer: hour,
        promptShort: `${hour} heures`,
        prompt: `Il est ${hour} heures. Place la petite aiguille.`,
      }
    }
    case 'shape': {
      const options = shuffle(rng, ['carré', 'rectangle', 'triangle', 'cercle'] as const)
      const target = pick(rng, options)
      return {
        id,
        type,
        competenceId,
        target,
        options,
        answer: target,
        promptShort: target,
        prompt: `Touche le ${target}.`,
      }
    }
    case 'grid-draw': {
      const size = 4
      const pattern = Array.from({ length: size * size }, () => rng() < 0.35)
      if (!pattern.some(Boolean)) pattern[5] = true
      return {
        id,
        type,
        competenceId,
        size,
        pattern,
        answer: pattern.map((v) => (v ? 1 : 0)),
        promptShort: 'Reproduis',
        prompt: 'Reproduis le tapis de Grizzy sur le quadrillage.',
      }
    }
    case 'solid': {
      const solid = pick(rng, ['cube', 'pavé'] as const)
      const ask = pick(rng, ['faces', 'sommets'] as const)
      const answer = ask === 'faces' ? 6 : 8
      return {
        id,
        type,
        competenceId,
        solid,
        ask,
        answer,
        promptShort: solid,
        prompt: `Combien de ${ask} a ce ${solid} ?`,
      }
    }
    case 'move-code': {
      const cols = 4
      const rows = 3
      const start: [number, number] = [0, rows - 1]
      const path: Array<'H' | 'B' | 'G' | 'D'> = []
      let x = 0
      let y = rows - 1
      const steps = randInt(rng, 3, 5)
      for (let i = 0; i < steps; i++) {
        const choices: Array<'H' | 'B' | 'G' | 'D'> = []
        if (x < cols - 1) choices.push('D')
        if (y > 0) choices.push('H')
        if (x > 0 && rng() < 0.3) choices.push('G')
        const fallback: Array<'H' | 'B' | 'G' | 'D'> = ['D']
        const dir = pick(rng, choices.length ? choices : fallback)
        path.push(dir)
        if (dir === 'D') x++
        if (dir === 'G') x--
        if (dir === 'H') y--
        if (dir === 'B') y++
      }
      return {
        id,
        type,
        competenceId,
        cols,
        rows,
        start,
        goal: [x, y],
        path,
        answer: path.length,
        promptShort: 'Le chemin',
        prompt: 'Guide le Lemming jusqu’au pot : haut, bas, gauche, droite.',
      }
    }
    case 'tally-table': {
      const labels = ['lundi', 'mardi', 'mercredi']
      const counts = labels.map(() => randInt(rng, 1, Math.min(8, max)))
      const askIndex = randInt(rng, 0, 2)
      return {
        id,
        type,
        competenceId,
        counts,
        labels,
        askIndex,
        answer: counts[askIndex],
        promptShort: 'Le tableau',
        prompt: `Combien de pots Grizzy a-t-il mangés ${labels[askIndex]} ?`,
      }
    }
    case 'bar-chart': {
      const labels = ['Grizzy', 'Lemmings', 'She-Bear']
      const values = labels.map(() => randInt(rng, 1, 8))
      const mode = rng() < 0.5 ? 'max' : 'value'
      const askIndex = randInt(rng, 0, 2)
      const maxI = values.indexOf(Math.max(...values))
      return {
        id,
        type,
        competenceId,
        values,
        labels,
        mode,
        askIndex,
        answer: mode === 'max' ? maxI : values[askIndex],
        promptShort: 'Le graphique',
        prompt:
          mode === 'max'
            ? 'Qui a le plus de cubes ?'
            : `Combien de cubes pour ${labels[askIndex]} ?`,
      }
    }
  }
}

function makeProblem(
  id: string,
  competenceId: string,
  rng: () => number,
  bank: string,
  max: number,
): Problem4phEx {
  const list = PROBLEM_BANK[bank] ?? PROBLEM_BANK.p1
  const base = pick(rng, list)
  const a = randInt(rng, 2, Math.min(8, max - 1))
  const b = randInt(rng, 1, Math.min(6, max - a))
  const whole = a + b
  const kind = base.unknown
  const answer = kind === 'whole' ? whole : kind === 'left' ? a : b
  const story = base.story
    .replaceAll('{a}', String(a))
    .replaceAll('{b}', String(b))
    .replaceAll('{w}', String(whole))
  const options = shuffle(rng, [
    { id: 'ok', label: base.good, correct: true },
    { id: 'ko1', label: base.bad1, correct: false },
    { id: 'ko2', label: base.bad2, correct: false },
  ])
  return {
    id,
    type: 'problem-4ph',
    competenceId,
    story,
    understandOptions: options,
    model: {
      kind: 'part-whole',
      left: kind === 'left' ? null : a,
      right: kind === 'right' ? null : b,
      whole: kind === 'whole' ? null : whole,
      unknown: kind,
    },
    unit: base.unit,
    regulationQuestion: base.regulation,
    regulationYes: base.regYes,
    answer,
    promptShort: 'Le problème',
    prompt: story,
  }
}
