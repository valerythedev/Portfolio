import { useCallback, useEffect, useState } from 'react'

import { prefersReducedMotion } from '../lib/gsap'

/** Pixels from bottom of document — show “terminal” escape hatch */
const NEAR_BOTTOM_PX = 160

export default function TerminalScrollUp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const scrollY = window.scrollY
      const viewH = window.innerHeight
      const docH = el.scrollHeight
      const distanceFromBottom = docH - scrollY - viewH
      const pastFold = scrollY > viewH * 0.35
      setVisible(pastFold && distanceFromBottom <= NEAR_BOTTOM_PX)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const goTop = useCallback(() => {
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    document.getElementById('hero')?.scrollIntoView({ behavior, block: 'start' })
  }, [])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[10001] flex justify-start px-2 pb-[max(5rem,env(safe-area-inset-bottom))] pt-8 sm:justify-center sm:px-4 md:pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto w-[min(100%,18rem)] max-w-sm overflow-hidden rounded-t-md border border-border border-b-0 bg-bg/95 shadow-[0_-8px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:w-full">
        <div className="flex items-center gap-2 border-b border-border bg-surface/90 px-3 py-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden />
          <span className="h-2 w-2 shrink-0 rounded-full bg-yellow-400" aria-hidden />
          <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" aria-hidden />
          <span className="flex-1 text-center font-mono text-[10px] uppercase tracking-wide text-muted">
            tty_scroll_up — eof
          </span>
        </div>
        <button
          type="button"
          onClick={goTop}
          className="flex w-full items-baseline gap-0 px-4 py-3 text-left font-mono text-sm transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-bright"
          aria-label="Scroll back to intro"
        >
          <span className="select-none text-[#22c55e]" aria-hidden>
            valery@portfolio
          </span>
          <span className="text-muted">:~$ </span>
          <span className="text-orange">cd .. </span>
          <span className="text-offwhite">{'&& '}</span>
          <span className="text-muted">./</span>
          <span className="text-orange-bright">hero</span>
          <span className="ml-1 inline-block animate-pulse text-orange" aria-hidden>
            ↑
          </span>
        </button>
      </div>
    </div>
  )
}
