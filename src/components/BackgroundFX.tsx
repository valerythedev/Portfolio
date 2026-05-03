import { useEffect, useMemo, useRef } from 'react'
import { prefersReducedMotion } from '../lib/gsap'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  a: number
  glyph: string
  size: number
  hue: number
}

const GLYPHS = ['$', '>', '_', '/', '.', '*', '+', '#', '{', '}', '[', ']']

function pick<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const dprRef = useRef(1)

  const reduced = useMemo(() => prefersReducedMotion(), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (reduced) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const BASE_BG = 'rgb(38, 38, 38)'
    const BASE_BG_FADE = 'rgba(38, 38, 38, 0.08)'

    const spawn = (w: number, h: number): Particle => {
      const speed = 0.05 + Math.random() * 0.18
      const angle = Math.random() * Math.PI * 2
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        a: 0.08 + Math.random() * 0.18,
        glyph: pick(GLYPHS),
        size: 10 + Math.random() * 10,
        // orange / cyan (avoid green cast in background)
        hue: Math.random() < 0.78 ? 26 : 200,
      }
    }

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      dprRef.current = dpr
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // keep particle count proportional but capped
      const target = Math.max(24, Math.min(70, Math.floor((w * h) / 32000)))
      const parts = particlesRef.current
      while (parts.length < target) parts.push(spawn(w, h))
      while (parts.length > target) parts.pop()
    }

    // init after spawn exists
    const init = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      particlesRef.current = []
      const target = Math.max(24, Math.min(70, Math.floor((w * h) / 32000)))
      for (let i = 0; i < target; i++) particlesRef.current.push(spawn(w, h))
    }

    init()
    resize()

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(48, now - last)
      last = now
      const w = window.innerWidth
      const h = window.innerHeight

      // fade previous frame slightly for trailing
      ctx.fillStyle = BASE_BG_FADE
      ctx.fillRect(0, 0, w, h)

      // subtle aurora glow (keep neutral; avoid green cast)
      const t = now * 0.00005
      const gx = w * (0.5 + 0.2 * Math.sin(t * 2.1))
      const gy = h * (0.35 + 0.2 * Math.cos(t * 1.7))
      const grad = ctx.createRadialGradient(
        gx,
        gy,
        40,
        gx,
        gy,
        Math.max(w, h) * 0.75
      )
      grad.addColorStop(0, 'rgba(128,52,9,0.10)') // orange
      // a hint of cyan instead of green
      grad.addColorStop(0.55, 'rgba(56,189,248,0.03)')
      grad.addColorStop(1, 'rgba(38,38,38,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'

      for (const p of particlesRef.current) {
        p.x += p.vx * dt
        p.y += p.vy * dt

        if (p.x < -40) p.x = w + 40
        if (p.x > w + 40) p.x = -40
        if (p.y < -40) p.y = h + 40
        if (p.y > h + 40) p.y = -40

        ctx.font = `${p.size}px JetBrains Mono, ui-monospace, monospace`
        ctx.fillStyle = `hsla(${p.hue} 85% 62% / ${p.a * 0.75})`
        ctx.fillText(p.glyph, p.x, p.y)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame((t) => {
      // paint one full bg first frame
      ctx.fillStyle = BASE_BG
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      tick(t)
    })

    const onVis = () => {
      if (document.hidden) {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      } else if (rafRef.current == null) {
        last = performance.now()
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [reduced])

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="h-full w-full opacity-45 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
    </div>
  )
}

