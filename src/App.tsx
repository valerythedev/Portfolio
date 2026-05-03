import { useState, useEffect, useCallback } from 'react'
import BootScreen from './components/BootScreen'
import Nav from './components/Nav'
import TerminalScrollUp from './components/TerminalScrollUp'
import BackgroundFX from './components/BackgroundFX'
import TravelingPath from './components/TravelingPath'
import BackgroundAudio from './components/BackgroundAudio'
import StackedPanels from './components/StackedPanels'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'

const EASTER_EGG_CODE = 'hire valery'
const EASTER_EGG_DURATION_MS = 2500

function App() {
  const [bootDone, setBootDone] = useState(false)
  const [easterEgg, setEasterEgg] = useState(false)
  const [easterEggBuffer, setEasterEggBuffer] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : ''
      const next = (easterEggBuffer + key).slice(-EASTER_EGG_CODE.length)
      setEasterEggBuffer(next)
      if (next === EASTER_EGG_CODE) {
        setEasterEgg(true)
        setEasterEggBuffer('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [easterEggBuffer])

  useEffect(() => {
    if (!easterEgg) return
    const t = setTimeout(() => setEasterEgg(false), EASTER_EGG_DURATION_MS)
    return () => clearTimeout(t)
  }, [easterEgg])

  const handleBootComplete = useCallback(() => setBootDone(true), [])

  return (
    <div className="relative min-h-screen font-mono text-offwhite">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <BackgroundFX />
      <TravelingPath />
      {/* Contrast veil: keeps UI readable while FX stays visible */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-bg/70"
        aria-hidden
      />
      {!bootDone && <BootScreen onComplete={handleBootComplete} />}

      {easterEgg && (
        <div
          className="fixed inset-0 z-[10001] flex flex-col items-center justify-center bg-bg px-4"
          role="dialog"
          aria-live="polite"
          aria-label="Easter egg"
        >
          <div
            className="absolute inset-0 bg-orange-bright opacity-20"
            aria-hidden
          />
          <div className="relative font-display text-center text-4xl text-orange md:text-6xl">
            <p className="orange-glow">✓ ACCESS GRANTED</p>
            <p className="mt-4 text-2xl text-offwhite md:text-4xl">
              Smart move.
            </p>
          </div>
        </div>
      )}

      <Nav />
      <TerminalScrollUp />
      <BackgroundAudio />
      <main id="main-content" className="relative z-10" tabIndex={-1}>
        <StackedPanels />
        <div className="stack-container">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </div>
      </main>
    </div>
  )
}

export default App
