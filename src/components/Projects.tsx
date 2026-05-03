import { useEffect, useRef } from 'react'
import { getGsap, prefersReducedMotion } from '../lib/gsap'

type Project = {
  title: string
  command: string
  description: string
  liveUrl: string
  /** When set, shows [store ↗] + [admin ↗] instead of a single [live ↗] */
  liveAdminUrl?: string
  /** Omit when the repo is private or there is no public GitHub link */
  githubUrl?: string
}

const PROJECTS: Project[] = [
  {
    title: 'Real-Time Chat Application',
    command: 'run chat-app --stack="TypeScript, React, Tailwind, Socket.IO"',
    description: `  Full-stack real-time chat with delivery receipts,
  read status, and online presence indicators.
  Modular monorepo architecture. Dark/light mode.`,
    liveUrl: 'https://chat-app-m-khaki.vercel.app/',
    githubUrl: 'https://github.com/valerythedev/ChatApp-m-',
  },
  {
    title: 'No Sea Mal Habla (E-commerce)',
    command:
      'run nsmhdemo --stack="React 19, TypeScript, Vite, Tailwind, Prisma, PostgreSQL"',
    description: `  Public demo: monorepo storefront + admin dashboard.
  Catalog, cart, checkout, i18n (5 langs), admin orders & products.
  REST API with JWT, Zod, Docker-ready.`,
    liveUrl: 'https://mi-tienda-store.onrender.com/',
    liveAdminUrl: 'https://mi-tienda-admin.onrender.com/',
    githubUrl: 'https://github.com/valerythedev/nsmhdemo',
  },
  {
    title: 'Palma Pixel Studios',
    command:
      'run palmapixel --stack="React, TypeScript, Branding, UX/UI, Deployment"',
    description: `  Creative digital agency — branding, web experiences,
  and full-cycle delivery from concept to production.
  Live site showcases the studio and selected client work.`,
    liveUrl: 'https://palmapixelstudios.com/',
  },
]

export default function Projects() {
  // GSAP: stagger in cards on first view
  return (
    <section
      id="projects"
      data-stack-panel
      className="stack-panel scroll-mt-16 border border-border px-4 py-16 font-mono md:px-8 lg:px-12"
      aria-labelledby="projects-heading"
    >
      <ProjectsInner />
    </section>
  )
}

function ProjectsInner() {
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (prefersReducedMotion()) return

    const { gsap } = getGsap()
    const cards = Array.from(
      el.querySelectorAll<HTMLElement>('[data-project-card]')
    )
    if (cards.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 18, rotateX: 6, transformOrigin: '50% 50%' },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="stack-panel-inner mx-auto max-w-5xl">
        <h2
          id="projects-heading"
          className="font-display text-2xl text-orange md:text-3xl"
        >
          &gt; ls ./projects
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <article
              key={project.title}
              data-project-card
              className={`group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all hover:border-orange hover:shadow-[0_0_20px_rgba(128,52,9,0.15)] ${i % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'}`}
            >
              <div className="flex items-center gap-2 border-b border-border bg-bg/80 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="flex-1 text-center text-xs text-muted">
                  {project.title}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4 text-sm">
                <p className="text-orange">$ {project.command}</p>
                <pre className="mt-2 flex-1 whitespace-pre-wrap text-muted">
                  {project.description}
                </pre>
                <div className="mt-4 flex flex-wrap gap-3">
                  {project.liveAdminUrl ? (
                    <>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-bright hover:underline focus-visible:ring-2 focus-visible:ring-orange-bright"
                        aria-label={`${project.title} — store demo`}
                      >
                        [store ↗]
                      </a>
                      <a
                        href={project.liveAdminUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-bright hover:underline focus-visible:ring-2 focus-visible:ring-orange-bright"
                        aria-label={`${project.title} — admin demo`}
                      >
                        [admin ↗]
                      </a>
                    </>
                  ) : (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-bright hover:underline focus-visible:ring-2 focus-visible:ring-orange-bright"
                      aria-label={`${project.title} live site`}
                    >
                      [live ↗]
                    </a>
                  )}
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-bright hover:underline focus-visible:ring-2 focus-visible:ring-orange-bright"
                      aria-label={`${project.title} GitHub`}
                    >
                      [github ↗]
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
  )
}
