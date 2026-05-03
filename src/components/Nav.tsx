import { useState, useCallback } from 'react'

import { prefersReducedMotion } from '../lib/gsap'

const SECTIONS = [
  { id: 'about', label: 'about' },
  { id: 'skills', label: 'skills' },
  { id: 'projects', label: 'projects' },
  { id: 'contact', label: 'contact' },
] as const

export default function Nav() {
  const [cdFlash, setCdFlash] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollIntoView = useCallback((id: string) => {
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
  }, [])

  const scrollTo = useCallback(
    (id: string) => {
      setCdFlash(id)
      setTimeout(() => setCdFlash(null), 100)
      scrollIntoView(id)
      setMenuOpen(false)
    },
    [scrollIntoView]
  )

  return (
    <nav
      className="sticky top-0 z-[100] border-b border-border bg-surface/80 font-mono text-sm backdrop-blur-md"
      role="navigation"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 md:px-6">
        <span className="hidden text-muted md:inline">
          valery@portfolio:~$
        </span>
        <div className="hidden gap-1 md:flex md:flex-1 md:justify-end">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className={`rounded px-2 py-1 transition-colors focus-visible:ring-2 focus-visible:ring-orange-bright ${
                cdFlash === id ? 'bg-orange text-bg' : 'text-offwhite hover:text-orange-bright'
              }`}
              aria-label={`Go to ${label} section`}
            >
              [{label}]
            </button>
          ))}
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-offwhite md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span className="text-muted">valery@portfolio:~$</span>
          <span className="text-orange">{menuOpen ? ' exit' : ' menu'}</span>
        </button>
      </div>

      {menuOpen && (
        <div
          className="absolute left-0 right-0 top-full border-t border-border bg-bg/98 backdrop-blur-md md:hidden"
          role="dialog"
          aria-label="Mobile menu"
        >
          <div className="flex flex-col gap-1 p-4">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className={`rounded px-3 py-2 text-left transition-colors focus-visible:ring-2 focus-visible:ring-orange-bright ${
                  cdFlash === id ? 'bg-orange text-bg' : 'text-offwhite hover:bg-surface'
                }`}
                aria-label={`Go to ${label} section`}
              >
                &gt; cd ./{label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
