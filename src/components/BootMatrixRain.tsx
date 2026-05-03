import { useEffect, useRef } from 'react'

type Props = { reducedMotion: boolean }

/** Falling 0/1 columns behind the boot terminal — Matrix-ish, scoped to boot only */
export default function BootMatrixRain({ reducedMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let drops: { y: number; speed: number }[] = []
    let frame = 0

    const FONT_SIZE = 13
    const TRAIL = 16

    const logicalSize = () => ({
      w: canvas!.clientWidth,
      h: canvas!.clientHeight,
    })

    const resize = () => {
      const el = canvas!.parentElement
      const w = el?.clientWidth ?? window.innerWidth
      const h = el?.clientHeight ?? window.innerHeight
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2)

      canvas!.width = Math.floor(w * dpr)
      canvas!.height = Math.floor(h * dpr)
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      ctx.font = `${FONT_SIZE}px JetBrains Mono, ui-monospace, monospace`

      const colCount = Math.ceil(w / FONT_SIZE) + 2
      drops = Array.from({ length: colCount }, () => ({
        y: Math.random() * -TRAIL,
        speed: 0.2 + Math.random() * 0.62,
      }))
    }

    const drawStatic = () => {
      const { w, h } = logicalSize()
      ctx.fillStyle = '#262626'
      ctx.fillRect(0, 0, w, h)

      for (let x = 0; x < w; x += FONT_SIZE) {
        for (let y = 0; y < h; y += FONT_SIZE) {
          if (Math.random() > 0.88) continue
          ctx.fillStyle = `rgba(74, 222, 128, ${0.06 + Math.random() * 0.1})`
          ctx.fillText(
            Math.random() > 0.5 ? '0' : '1',
            x,
            y + FONT_SIZE - 3
          )
        }
      }
    }

    const tick = () => {
      frame++
      const { w, h } = logicalSize()

      ctx.fillStyle = 'rgba(38, 38, 38, 0.22)'
      ctx.fillRect(0, 0, w, h)

      for (let i = 0; i < drops.length; i++) {
        const x = i * FONT_SIZE
        drops[i].y += drops[i].speed

        const maxY = h / FONT_SIZE + TRAIL + 4
        if (drops[i].y > maxY) {
          drops[i].y = Math.random() * -TRAIL - 8
          drops[i].speed = 0.2 + Math.random() * 0.62
        }

        const head = drops[i].y

        for (let j = 0; j < TRAIL; j++) {
          const gy = (head - j) * FONT_SIZE
          if (gy < -FONT_SIZE || gy > h + FONT_SIZE) continue

          const bit =
            ((i * 97 + j * 41 + frame + Math.floor(head)) & 1) === 0 ? '0' : '1'

          if (j === 0) {
            ctx.fillStyle = 'rgba(187, 247, 208, 0.92)'
          } else {
            const fade = Math.max(0, (TRAIL - j) / TRAIL)
            ctx.fillStyle = `rgba(74, 222, 128, ${fade * 0.38})`
          }
          ctx.fillText(bit, x, gy + FONT_SIZE - 3)
        }
      }

      raf = requestAnimationFrame(tick)
    }

    const parent = canvas.parentElement ?? document.documentElement
    const ro = new ResizeObserver(() => {
      resize()
      if (reducedMotion) drawStatic()
    })
    ro.observe(parent)
    resize()

    if (reducedMotion) {
      drawStatic()
      return () => ro.disconnect()
    }

    {
      const { w, h } = logicalSize()
      ctx.fillStyle = '#262626'
      ctx.fillRect(0, 0, w, h)
    }

    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.55]"
      aria-hidden
    />
  )
}
