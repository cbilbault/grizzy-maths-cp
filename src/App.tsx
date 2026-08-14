import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { FreePlay } from './components/kid/FreePlay'
import { Home } from './components/kid/Home'
import { MissionPlay, RitualPlay } from './components/kid/PlaySession'
import { Parent } from './components/parent/Parent'
import { setPreferredVoice } from './audio/tts'
import { useProgress } from './state/store'

export default function App() {
  const reduceMotion = useProgress((s) => s.reduceMotion)
  const voiceName = useProgress((s) => s.voiceName)
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion)
  }, [reduceMotion])
  useEffect(() => {
    setPreferredVoice(voiceName)
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices()
    }
  }, [voiceName])
  return (
    <HashRouter>
      <div className="flex h-full min-h-dvh flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mission/:id" element={<MissionPlay />} />
          <Route path="/rituel" element={<RitualPlay />} />
          <Route path="/libre" element={<FreePlay />} />
          <Route path="/parents" element={<Parent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
