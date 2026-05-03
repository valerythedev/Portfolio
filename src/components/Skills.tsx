import { useEffect, useRef } from 'react'
import { getGsap, prefersReducedMotion } from '../lib/gsap'

const SKILLS = [
  { name: 'JavaScript (ES6+)', pct: 90 },
  { name: 'TypeScript', pct: 85 },
  { name: 'React.js', pct: 90 },
  { name: 'Node.js / Express', pct: 70 },
  { name: 'MongoDB / Prisma', pct: 65 },
  { name: 'HTML5 / CSS3', pct: 95 },
  { name: 'Tailwind / MUI', pct: 88 },
  { name: 'GSAP Animations', pct: 68 },
  { name: 'Figma / UI/UX', pct: 75 },
  { name: 'MySQL', pct: 60 },
] as const

const TOOLS_TEXT = `  Git/GitHub · REST APIs · Postman · Socket.IO
  Agile/Scrum · OOP · Application Architecture
  Responsive Design · SEO Best Practices`

function SkillRow({
  name,
  pct,
  perms,
}: {
  name: string
  pct: number
  perms: string
}) {
  return (
    <div className="flex flex-nowrap items-center gap-2 py-0.5 font-mono text-sm">
      <span className="w-10 shrink-0 text-muted">{perms}</span>
      <span className="min-w-[160px] whitespace-nowrap text-offwhite md:min-w-[220px]">
        {name}
      </span>
      <span className="flex flex-1 items-center gap-2">
        <span className="inline-block h-4 flex-1 max-w-[200px] overflow-hidden rounded bg-surface">
          <span
            data-skill-bar
            data-skill-pct={pct}
            className="block h-full bg-orange"
            style={{
              width: prefersReducedMotion() ? `${pct}%` : '0%',
            }}
          />
        </span>
        <span className="w-10 text-muted">{pct}%</span>
      </span>
    </div>
  )
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = prefersReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (reducedMotion) return

    const { gsap } = getGsap()
    const bars = Array.from(el.querySelectorAll<HTMLElement>('[data-skill-bar]'))
    if (bars.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bars,
        { width: '0%' },
        {
          width: (_, target) =>
            `${Number((target as HTMLElement).dataset.skillPct ?? 0)}%`,
          duration: 0.9,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
        }
      )

      // Ensure triggers compute correctly after layout/FX changes.
      Promise.resolve().then(() => {
        const { ScrollTrigger } = getGsap()
        ScrollTrigger.refresh()
      })
    }, el)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="skills"
      data-stack-panel
      className="stack-panel scroll-mt-16 border border-border px-4 py-16 font-mono md:px-8 lg:px-12"
      aria-labelledby="skills-heading"
    >
      <div className="stack-panel-inner mx-auto max-w-4xl">
        <h2
          id="skills-heading"
          className="font-display text-2xl text-orange md:text-3xl"
        >
          &gt; ls -la ./skills
        </h2>

        <div className="mt-6 space-y-0">
          {SKILLS.map((skill, i) => (
            <SkillRow
              key={skill.name}
              name={skill.name}
              pct={skill.pct}
              perms={i === SKILLS.length - 1 ? '-rw-r--r--' : '-rwxr--r--'}
            />
          ))}
        </div>

        <div className="mt-10">
          <p className="font-display text-lg text-orange">
            &gt; cat ./tools.txt
          </p>
          <pre className="mt-2 whitespace-pre-wrap text-sm text-muted">
            {TOOLS_TEXT}
          </pre>
        </div>
      </div>
    </section>
  )
}
