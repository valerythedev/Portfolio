import { useEffect } from 'react'
import { getGsap, prefersReducedMotion } from '../lib/gsap'

export default function StackedPanels() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const { gsap } = getGsap()

    const panels = Array.from(
      document.querySelectorAll<HTMLElement>('[data-stack-panel]')
    )
    if (panels.length < 2) return

    const ctx = gsap.context(() => {
      panels.forEach((panel, i) => {
        // light depth only (no sticky/pinning)
        panel.style.zIndex = String(10 + i)
        gsap.set(panel, {
          transformPerspective: 900,
          transformOrigin: '50% 0%',
        })
      })

      panels.forEach((panel) => {
        gsap.fromTo(
          panel,
          { autoAlpha: 0.98, y: 0 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.01,
            scrollTrigger: { trigger: panel, start: 'top 92%', once: true },
          }
        )

        gsap.to(panel, {
          boxShadow: '0 14px 48px rgba(0,0,0,0.30)',
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top 70%',
            end: 'top 20%',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return null
}

