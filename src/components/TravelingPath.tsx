import { useEffect, useRef } from 'react'
import { getGsap, prefersReducedMotion } from '../lib/gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

export default function TravelingPath() {
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (prefersReducedMotion()) return

    const { gsap } = getGsap()
    gsap.registerPlugin(MotionPathPlugin)

    const path = el.querySelector<SVGPathElement>('[data-path]')
    const fishes = Array.from(el.querySelectorAll<SVGGElement>('[data-fish]'))
    if (!path || fishes.length === 0) return

    const ctx = gsap.context(() => {
      fishes.forEach((fish, idx) => {
        const tail = fish.querySelector<SVGPathElement>('[data-tail]')
        gsap.set(fish, { transformOrigin: '50% 50%' })

        // Swim along the path (staggered offsets)
        gsap.to(fish, {
          duration: 42 - idx * 6,
          repeat: -1,
          ease: 'none',
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0.08 + idx * 0.22,
            end: 1.08 + idx * 0.22,
          },
        })

        // Gentle bob + scale breathing
        gsap.to(fish, {
          y: `+=${6 + idx * 2}`,
          duration: 2.6 + idx * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
        gsap.to(fish, {
          scale: 1.06,
          duration: 2.1 + idx * 0.25,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })

        // Tail wag
        if (tail) {
          gsap.to(tail, {
            rotate: idx % 2 === 0 ? 14 : -14,
            transformOrigin: '10% 50%',
            duration: 0.35 + idx * 0.05,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        }
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed inset-0 z-[5] opacity-80"
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="tp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.85 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="tp-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
            <stop offset="55%" stopColor="#60a5fa" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        <path
          data-path
          d="M 60 140 C 220 40, 340 80, 440 170 S 650 300, 720 180 S 890 120, 960 250
             C 990 330, 880 420, 760 410 S 520 420, 430 520 S 260 680, 80 560"
          fill="none"
          stroke="url(#tp-stroke)"
          strokeWidth="3"
          strokeDasharray="7 10"
          vectorEffect="non-scaling-stroke"
          opacity="0.9"
        />

        {/* Fish sprites (very simple shapes, animated via MotionPath) */}
        <g data-fish filter="url(#tp-glow)" opacity="0.85">
          {/* body */}
          <ellipse cx="0" cy="0" rx="12" ry="7" fill="#60a5fa" />
          {/* tail */}
          <path
            data-tail
            d="M -12 0 L -22 -7 L -20 0 L -22 7 Z"
            fill="#a78bfa"
          />
          {/* eye */}
          <circle cx="6" cy="-1" r="1.3" fill="#e8e4dc" opacity="0.9" />
        </g>

        <g data-fish filter="url(#tp-glow)" opacity="0.75">
          <ellipse cx="0" cy="0" rx="10" ry="6" fill="#f97316" />
          <path
            data-tail
            d="M -10 0 L -18 -6 L -16 0 L -18 6 Z"
            fill="#60a5fa"
          />
          <circle cx="5" cy="-1" r="1.2" fill="#e8e4dc" opacity="0.9" />
        </g>

        <g data-fish filter="url(#tp-glow)" opacity="0.65">
          <ellipse cx="0" cy="0" rx="9" ry="5.5" fill="#a78bfa" />
          <path
            data-tail
            d="M -9 0 L -16 -5 L -14 0 L -16 5 Z"
            fill="#f97316"
          />
          <circle cx="4.5" cy="-0.8" r="1.1" fill="#e8e4dc" opacity="0.9" />
        </g>
      </svg>
    </div>
  )
}

