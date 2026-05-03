import { useState, useEffect } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useTypewriter(
  fullText: string,
  charDelayMs: number = 40,
  startAfterMs: number = 0
): string {
  const reducedMotion = prefersReducedMotion()
  const [displayed, setDisplayed] = useState(() =>
    reducedMotion ? fullText : ''
  )
  const [started, setStarted] = useState(() => reducedMotion || startAfterMs <= 0)

  useEffect(() => {
    if (reducedMotion) return

    if (startAfterMs > 0 && !started) {
      const t = setTimeout(() => setStarted(true), startAfterMs)
      return () => clearTimeout(t)
    }

    if (!started || displayed.length >= fullText.length) return

    const t = setTimeout(() => {
      setDisplayed(fullText.slice(0, displayed.length + 1))
    }, charDelayMs)
    return () => clearTimeout(t)
  }, [fullText, charDelayMs, startAfterMs, started, displayed, reducedMotion])

  return displayed
}
