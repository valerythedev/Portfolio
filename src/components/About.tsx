import { useEffect, useRef } from 'react'
import { getGsap, prefersReducedMotion } from '../lib/gsap'

const ASCII_VG = `
██╗   ██╗ ██████╗ 
██║   ██║██╔════╝ 
██║   ██║██║  ███╗
╚██╗ ██╔╝██║   ██║
 ╚████╔╝ ╚██████╔╝
  ╚═══╝   ╚═════╝ 
`.trim()

export default function About() {
  const asciiRef = useRef<HTMLPreElement | null>(null)

  useEffect(() => {
    const el = asciiRef.current
    if (!el) return

    const { gsap } = getGsap()
    const reduced = prefersReducedMotion()

    const ctx = gsap.context(() => {
      gsap.set(el, {
        transformOrigin: '50% 50%',
        rotationX: 0,
        rotationY: reduced ? 0 : -40,
        rotationZ: 0,
        force3D: true,
      })

      if (reduced) return

      gsap.to(el, {
        rotationY: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 15%',
          scrub: 1.2,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      data-stack-panel
      className="stack-panel scroll-mt-16 border border-border px-4 py-16 font-mono md:px-8 lg:px-12"
      aria-labelledby="about-heading"
    >
      <div className="stack-panel-inner mx-auto max-w-5xl">
        <h2
          id="about-heading"
          className="font-display text-2xl text-orange md:text-3xl"
        >
          &gt; cat about.txt
        </h2>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start">
          <div
            className="vg-3d-wrap"
            style={{ perspective: '800px' }}
            aria-hidden
          >
            <pre
              ref={asciiRef}
              className="ascii-vg vg-3d whitespace-pre text-lg leading-tight text-orange md:text-2xl"
              aria-hidden
            >
              {ASCII_VG}
            </pre>
          </div>

          <div className="space-y-2 text-sm text-offwhite md:text-base">
            <div>
              <span className="text-muted">NAME:</span>
              <span className="ml-2">Valery Gonzalez</span>
            </div>
            <div>
              <span className="text-muted">ROLE:</span>
              <span className="ml-2">
                Front-End Engineer | React &amp; MERN Developer
              </span>
            </div>
            <div>
              <span className="text-muted">SCHOOL:</span>
              <span className="ml-2">Berklee College of Music</span>
            </div>
            <div className="ml-[5.1rem] text-muted">
              B.A. Music Business Management
            </div>

            <p className="pt-4">
              <span className="text-muted">SUMMARY:</span>
            </p>
            <p className="text-muted">
              {'  '}Front-end engineer with a background in music business and a
              bias toward shipping. Specializes in React, TypeScript, and the
              MERN stack — with a designer&apos;s eye for UI/UX and a product
              mindset sharpened at Apple Inc.
            </p>
            <p className="text-muted">
              {'  '}Built Palma Pixel Studios from brand identity through
              deployment. Believes the best interfaces feel inevitable — like
              they couldn&apos;t have been built any other way.
            </p>

            <p className="pt-2">
              <span className="text-muted">LANGUAGES:</span>{' '}
              English (Fluent) · Spanish (Fluent)
            </p>
            <p className="text-muted">           Portuguese (Intermediate)</p>
          </div>
        </div>
      </div>
    </section>
  )
}

