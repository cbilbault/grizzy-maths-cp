import { forSpeech, pickFrenchVoice } from './pronounce'

let unlocked = false
let cachedVoice: SpeechSynthesisVoice | null = null
let preferredName = ''
let speakTimer = 0

export function unlockAudio() {
  unlocked = true
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  void loadVoices()
}

export function setPreferredVoice(name: string) {
  preferredName = name
  cachedVoice = null
}

export function listFrenchVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  return window.speechSynthesis
    .getVoices()
    .filter((v) => /^fr\b/i.test(v.lang) || /français|french/i.test(v.name))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([])
      return
    }
    const grab = () => window.speechSynthesis.getVoices()
    const now = grab()
    if (now.length) {
      resolve(now)
      return
    }
    const done = () => resolve(grab())
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true })
    window.setTimeout(done, 700)
  })
}

function applyVoice(u: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]) {
  const voice = pickFrenchVoice(voices, preferredName)
  cachedVoice = voice
  if (voice) {
    u.voice = voice
    u.lang = voice.lang || 'fr-FR'
  } else {
    u.lang = 'fr-FR'
  }
  // Voix plus vive et enjouée — un peu plus rapide, un peu plus aiguë.
  u.rate = 1.08
  u.pitch = 1.18
  u.volume = 1
}

export function speak(text: string, enabled = true) {
  if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) return
  if (!unlocked && !document.hasFocus()) return
  const spoken = forSpeech(text)
  if (!spoken) return

  window.speechSynthesis.cancel()
  if (speakTimer) window.clearTimeout(speakTimer)

  speakTimer = window.setTimeout(() => {
    const fire = (voices: SpeechSynthesisVoice[]) => {
      const u = new SpeechSynthesisUtterance(spoken)
      applyVoice(u, cachedVoice ? [cachedVoice, ...voices] : voices)
      window.speechSynthesis.speak(u)
    }
    const already = window.speechSynthesis.getVoices()
    if (already.length) fire(already)
    else void loadVoices().then(fire)
  }, 60)
}

export function stopSpeak() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  if (speakTimer) window.clearTimeout(speakTimer)
  window.speechSynthesis.cancel()
}
