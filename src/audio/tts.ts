let unlocked = false

export function unlockAudio() {
  unlocked = true
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
}

export function speak(text: string, enabled = true) {
  if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) return
  if (!unlocked && !document.hasFocus()) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'fr-FR'
  u.rate = 0.92
  u.pitch = 1.05
  const voices = window.speechSynthesis.getVoices()
  const fr = voices.find((v) => v.lang.startsWith('fr'))
  if (fr) u.voice = fr
  window.speechSynthesis.speak(u)
}

export function stopSpeak() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
}
