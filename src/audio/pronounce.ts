import { numberToFrench } from '../lib/french'

/** Rewrite on-screen text so a French TTS engine says it clearly and cheerfully. */
export function forSpeech(text: string): string {
  let t = text

  t = t.replace(/Grizzy/gi, 'Grizi')
  t = t.replace(/Lemmings/gi, 'Lé-mingues')
  t = t.replace(/Lemming/gi, 'Lé-mingue')
  t = t.replace(/She-Bear/gi, 'la belle ourse')
  t = t.replace(/\bCP\b/g, 'cé pé')

  t = t.replace(/□/g, ' carré ')
  t = t.replace(/\+/g, ' plus ')
  t = t.replace(/[−–—]/g, ' moins ')
  t = t.replace(/(?<![<>])=(?![=])/g, ' égale ')
  t = t.replace(/≤/g, ' plus petit ou égal à ')
  t = t.replace(/≥/g, ' plus grand ou égal à ')
  t = t.replace(/</g, ' plus petit que ')
  t = t.replace(/>/g, ' plus grand que ')
  t = t.replace(/€/g, ' euros ')
  t = t.replace(/\bcm\b/gi, ' centimètres ')
  t = t.replace(/\bmin\b/g, ' minutes ')

  t = t.replace(/\b(\d{1,3})\b/g, (_, raw) => {
    const n = Number(raw)
    if (!Number.isInteger(n) || n < 0 || n > 100) return raw
    return numberToFrench(n)
  })

  t = t.replace(/\s+/g, ' ').trim()
  if (t && !/[.!?…]$/.test(t)) t += '.'
  return t
}

export function scoreFrenchVoice(v: { name: string; lang: string; localService?: boolean }): number {
  const name = v.name
  const lang = v.lang.toLowerCase()
  if (!/^fr\b/.test(lang) && !/français|french/i.test(name)) return -1000

  let s = 0
  if (/natural|neural|online|enhanced|premium/i.test(name)) s += 45
  if (/google/i.test(name)) s += 40
  if (/denise|hortense|julie|marie|audrey|aria|solange|brigitte/i.test(name)) s += 38
  if (/amélie|amelie|aurelie|aurélie|céline|celine/i.test(name)) s += 28
  if (/thomas|paul/i.test(name)) s += 8
  if (lang.startsWith('fr-fr') || lang.startsWith('fr_fr')) s += 22
  else if (lang.startsWith('fr-ca') || lang.startsWith('fr_ca')) s += 8
  else if (lang.startsWith('fr')) s += 12
  if (/female|femme|woman/i.test(name)) s += 12
  if (v.localService === false) s += 6
  if (/english|en-us|en_gb|español|deutsch/i.test(name) && !/fr/i.test(lang)) s -= 80
  return s
}

export function pickFrenchVoice<T extends { name: string; lang: string; localService?: boolean }>(
  voices: readonly T[],
  preferredName?: string,
): T | null {
  if (preferredName) {
    const exact = voices.find((v) => v.name === preferredName)
    if (exact) return exact
  }
  const ranked = [...voices].map((v) => ({ v, s: scoreFrenchVoice(v) })).filter((x) => x.s > 0)
  ranked.sort((a, b) => b.s - a.s)
  return ranked[0]?.v ?? null
}
