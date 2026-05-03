import { useState, useEffect } from 'react'

import { dispatchBootAudioTry } from '../lib/musicUnlockEvents'
import BootMatrixRain from './BootMatrixRain'

const BOOT_LINES = [
  'BOOTING PORTFOLIO_OS v2.0...',
  '> Loading: React + TypeScript ........... OK',
  '> Loading: MERN Stack ................... OK',
  '> Loading: GSAP / Animations ............ OK',
  '> Loading: Bilingual Support [EN/ES] .... OK',
  '> Welcome, visitor.',
]
const CHAR_DELAY_MS = 40
const FADE_DELAY_MS = 500
const FADE_DURATION_MS = 600

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function BootScreen({
  onComplete,
}: {
  onComplete: () => void
}) {
  const reducedMotion = prefersReducedMotion()
  const [currentLineIndex, setCurrentLineIndex] = useState(() =>
    reducedMotion ? BOOT_LINES.length : 0
  )
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    if (reducedMotion) {
      const t = setTimeout(() => setFadeOut(true), FADE_DELAY_MS)
      const t2 = setTimeout(() => {
        setMounted(false)
        onComplete()
      }, FADE_DELAY_MS + FADE_DURATION_MS + 100)
      return () => {
        clearTimeout(t)
        clearTimeout(t2)
      }
    }

    if (currentLineIndex >= BOOT_LINES.length) {
      const t1 = setTimeout(() => setFadeOut(true), FADE_DELAY_MS)
      const t2 = setTimeout(() => {
        setMounted(false)
        onComplete()
      }, FADE_DELAY_MS + FADE_DURATION_MS + 100)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }

    const line = BOOT_LINES[currentLineIndex]
    if (currentCharIndex < line.length) {
      const t = setTimeout(
        () => setCurrentCharIndex((c) => c + 1),
        CHAR_DELAY_MS
      )
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setCurrentLineIndex((i) => i + 1)
      setCurrentCharIndex(0)
    }, 0)
    return () => clearTimeout(t)
  }, [currentLineIndex, currentCharIndex, onComplete, reducedMotion])

  if (!mounted) return null

  const completedLines = BOOT_LINES.slice(0, currentLineIndex)
  const currentLine = BOOT_LINES[currentLineIndex]
  const currentPartial = currentLine
    ? currentLine.slice(0, currentCharIndex)
    : ''
  const showCursor =
    currentLineIndex < BOOT_LINES.length &&
    currentCharIndex >= (currentLine?.length ?? 0)

  return (
    <div
      className="fixed inset-0 z-[10000] flex cursor-pointer flex-col items-start justify-center overflow-hidden bg-bg px-8 font-mono text-offwhite"
      style={{
        transition: `opacity ${FADE_DURATION_MS}ms ease-out`,
        opacity: fadeOut ? 0 : 1,
      }}
      aria-live="polite"
      aria-label="Boot sequence — tap anywhere"
      onPointerDownCapture={() => dispatchBootAudioTry()}
    >
      <BootMatrixRain reducedMotion={reducedMotion} />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-bg/40 via-transparent to-bg/55"
        aria-hidden
      />
      <div className="relative z-10 mx-auto w-full max-w-xl space-y-1 rounded-sm bg-bg/55 px-5 py-6 shadow-[0_0_48px_rgba(0,0,0,0.35)] ring-1 ring-emerald-500/15 backdrop-blur-[2px] md:px-6 md:py-8">
        {completedLines.map((text, i) => (
          <div key={i} className="text-sm md:text-base">
            {text}
          </div>
        ))}
        {currentPartial && (
          <div className="text-sm md:text-base">{currentPartial}</div>
        )}
        {showCursor && (
          <span className="blink inline-block w-2 bg-cursor" aria-hidden />
        )}
      </div>
    </div>
  )
}
