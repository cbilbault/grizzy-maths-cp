import { describe, expect, it } from 'vitest'
import { forSpeech, pickFrenchVoice, scoreFrenchVoice } from './pronounce'

describe('forSpeech', () => {
  it('dit les noms à la française', () => {
    expect(forSpeech('Grizzy et les Lemmings')).toMatch(/Grizi/)
    expect(forSpeech('Grizzy et les Lemmings')).toMatch(/Lé-mingues/)
  })

  it('lit les égalités comme un maître de CP', () => {
    expect(forSpeech('4 + □ = 10')).toBe('quatre plus carré égale dix.')
  })

  it('lit les euros et les signes', () => {
    expect(forSpeech('Compose 5 €')).toMatch(/cinq euros/)
  })
})

describe('pickFrenchVoice', () => {
  it('préfère une voix naturelle française enjouée', () => {
    const voices = [
      { name: 'Microsoft David', lang: 'en-US' },
      { name: 'Thomas', lang: 'fr-FR' },
      { name: 'Google français', lang: 'fr-FR' },
      { name: 'Microsoft Denise Online (Natural)', lang: 'fr-FR' },
    ]
    expect(pickFrenchVoice(voices)?.name).toBe('Microsoft Denise Online (Natural)')
    expect(scoreFrenchVoice(voices[2])).toBeGreaterThan(scoreFrenchVoice(voices[1]))
  })

  it('honore le choix parent', () => {
    const voices = [
      { name: 'Google français', lang: 'fr-FR' },
      { name: 'Amélie', lang: 'fr-CA' },
    ]
    expect(pickFrenchVoice(voices, 'Amélie')?.name).toBe('Amélie')
  })
})
