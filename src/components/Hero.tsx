import { useTypewriter } from '../hooks/useTypewriter'
import { useEffect, useRef } from 'react'
import { getGsap, prefersReducedMotion } from '../lib/gsap'

const GITHUB_URL = 'https://github.com/valerythedev'
const LINKEDIN_URL = 'https://www.linkedin.com/in/valery-gonzalez/'

export default function Hero() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const whoami = useTypewriter('> whoami', 30, 0)
  const showCursor = whoami.length < '> whoami'.length

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (prefersReducedMotion()) return

    const { gsap } = getGsap()
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-hero-reveal]'))

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.06,
          delay: 0.1,
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      data-stack-panel
      className="stack-panel min-h-[80vh] border border-border px-4 py-16 font-mono md:px-8 lg:px-12"
      aria-label="Introduction"
    >
      <div ref={wrapRef} className="stack-panel-inner mx-auto max-w-3xl">
        <div className="text-sm text-offwhite md:text-base" data-hero-reveal>
          <div className="flex items-center gap-2">
            <span className="text-[#22c55e]" aria-hidden>
              &gt;
            </span>
            <span className="tracking-tight">{whoami.replace(/^>\s?/, '')}</span>
            {showCursor && (
              <span className="blink text-cursor" aria-hidden>
                _
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <h1
            className="font-display text-5xl leading-none text-offwhite md:text-6xl"
            data-hero-reveal
          >
            Valery Gonzalez
          </h1>
          <p className="text-lg text-[#60a5fa] md:text-xl" data-hero-reveal>
            Front-End Engineer · React &amp; MERN Developer
          </p>
          <p className="text-sm text-muted md:text-base" data-hero-reveal>
            Berklee College of Music <span className="px-2">·</span> EN
            <span className="px-2">·</span> ES <span className="px-2">·</span>{' '}
            PT
          </p>
          <p className="text-base italic text-[#a78bfa] md:text-lg" data-hero-reveal>
            &quot;Building at the intersection of code, culture &amp;
            creativity.&quot;
          </p>
        </div>

        <div
          className="mt-7 flex flex-wrap gap-2 border-b border-border pb-6"
          data-hero-reveal
        >
          {[
            { label: 'React', tone: 'text-[#60a5fa]' },
            { label: 'Node.js', tone: 'text-[#22c55e]' },
            { label: 'MongoDB', tone: 'text-[#22c55e]' },
            { label: 'Express', tone: 'text-offwhite' },
            { label: 'TypeScript', tone: 'text-[#60a5fa]' },
            { label: 'Git', tone: 'text-[#f97316]' },
          ].map((t) => (
            <span
              key={t.label}
              className={`rounded border border-border bg-surface px-3 py-1 text-xs md:text-sm ${t.tone}`}
            >
              {t.label}
            </span>
          ))} 
        </div>

        <div className="mt-7 grid grid-cols-2 gap-6 md:grid-cols-4" data-hero-reveal>
          {[
            { value: '3+', label: 'years exp' },
            { value: '3', label: 'languages' },
            { value: 'MERN', label: 'stack' },
            { value: 'BM', label: 'Berklee' },
          ].map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="text-3xl text-[#22c55e] md:text-4xl">
                {s.value}
              </div>
              <div className="text-xs text-muted md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3" data-hero-reveal>
          <button
            type="button"
            onClick={() => scrollTo('projects')}
            className="rounded border border-border bg-surface px-4 py-2 text-sm text-offwhite transition-colors hover:border-orange hover:text-orange-bright focus-visible:ring-2 focus-visible:ring-orange-bright"
            aria-label="View projects"
          >
            [./view-projects]
          </button>
          <button
            type="button"
            onClick={() => scrollTo('contact')}
            className="rounded border border-border bg-surface px-4 py-2 text-sm text-offwhite transition-colors hover:border-orange hover:text-orange-bright focus-visible:ring-2 focus-visible:ring-orange-bright"
            aria-label="Contact me"
          >
            [./contact-me]
          </button>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-border bg-surface px-4 py-2 text-sm text-offwhite transition-colors hover:border-orange hover:text-orange-bright focus-visible:ring-2 focus-visible:ring-orange-bright"
            aria-label="Open GitHub in new tab"
          >
            [./github ↗]
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-border bg-surface px-4 py-2 text-sm text-offwhite transition-colors hover:border-orange hover:text-orange-bright focus-visible:ring-2 focus-visible:ring-orange-bright"
            aria-label="Open LinkedIn in new tab"
          >
            [./linkedin ↗]
          </a>
        </div>
      </div>
    </section>
  )
}
