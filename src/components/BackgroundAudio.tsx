import { useEffect, useMemo, useRef, useState } from 'react'

import bgTrackUrl from '../assets/bg.mp3?url'
import { VLGR_BOOT_AUDIO_TRY } from '../lib/musicUnlockEvents'

/** Bump when defaults / schema change — avoids stale “music off” stuck states */
const STORAGE_KEY = 'vlgr:bg-music:v3'
const DEFAULT_VOLUME = 0.18

type Stored = {
  enabled: boolean
  volume: number
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

function readStored(): Stored {
  if (typeof window === 'undefined')
    return { enabled: true, volume: DEFAULT_VOLUME }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { enabled: true, volume: DEFAULT_VOLUME }
    const parsed = JSON.parse(raw) as Partial<Stored>
    const enabled = parsed.enabled !== false
    let volume =
      typeof parsed.volume === 'number' ? clamp01(parsed.volume) : DEFAULT_VOLUME
    if (volume === 0) volume = DEFAULT_VOLUME
    return { enabled, volume }
  } catch {
    return { enabled: true, volume: DEFAULT_VOLUME }
  }
}

function writeStored(next: Stored) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
}

/** Sync HTMLAudioElement.play() — must run directly from user-input handlers */
function tryPlayElement(
  a: HTMLAudioElement | null,
  errored: boolean,
  setAudible: (v: boolean) => void
): void {
  if (!a || errored) return
  a.muted = false
  try {
    const p = a.play()
    if (p !== undefined) {
      void p.then(() => setAudible(true)).catch(() => setAudible(false))
    } else {
      setAudible(true)
    }
  } catch {
    setAudible(false)
  }
}

export default function BackgroundAudio() {
  const initial = useMemo(() => readStored(), [])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const musicUiRef = useRef<HTMLDivElement | null>(null)
  const enabledRef = useRef(initial.enabled)
  const erroredRef = useRef(false)

  const [enabled, setEnabled] = useState(initial.enabled)
  const [volume, setVolume] = useState(initial.volume)
  const [ready, setReady] = useState(false)
  const [errored, setErrored] = useState(false)
  const [audible, setAudible] = useState(false)

  enabledRef.current = enabled
  erroredRef.current = errored

  useEffect(() => {
    writeStored({ enabled, volume })
  }, [enabled, volume])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = clamp01(volume)
  }, [volume])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    if (!enabled) {
      a.pause()
      setAudible(false)
    }
  }, [enabled])

  useEffect(() => {
    const a = audioRef.current
    if (!a || !enabled || errored) return

    let dead = false
    const kick = () => {
      if (!dead && enabledRef.current && !erroredRef.current) {
        a.muted = false
        try {
          const p = a.play()
          if (p !== undefined) {
            void p.then(() => setAudible(true)).catch(() => {})
          }
        } catch {
          /* autoplay blocked until gesture */
        }
      }
    }

    a.addEventListener('canplay', kick)
    a.addEventListener('loadeddata', kick)
    kick()

    return () => {
      dead = true
      a.removeEventListener('canplay', kick)
      a.removeEventListener('loadeddata', kick)
    }
  }, [enabled, errored])

  useEffect(() => {
    const onBootTry = () => {
      setEnabled(true)
      tryPlayElement(audioRef.current, erroredRef.current, setAudible)
    }
    window.addEventListener(VLGR_BOOT_AUDIO_TRY, onBootTry)
    return () => window.removeEventListener(VLGR_BOOT_AUDIO_TRY, onBootTry)
  }, [])

  useEffect(() => {
    if (!enabled || errored || audible) return

    const onGesture = (e: Event) => {
      const t = e.target
      if (t instanceof Node && musicUiRef.current?.contains(t)) return
      if (!enabledRef.current || erroredRef.current) return
      tryPlayElement(audioRef.current, erroredRef.current, setAudible)
    }

    window.addEventListener('pointerdown', onGesture, { capture: true, passive: true })
    window.addEventListener('keydown', onGesture, { capture: true })
    window.addEventListener('touchstart', onGesture, { capture: true, passive: true })

    return () => {
      window.removeEventListener('pointerdown', onGesture, { capture: true })
      window.removeEventListener('keydown', onGesture, { capture: true })
      window.removeEventListener('touchstart', onGesture, { capture: true })
    }
  }, [enabled, errored, audible])

  const label = useMemo(() => {
    if (errored) return '[music: missing file]'
    if (!enabled) return '[music: off]'
    if (!audible) return '[music: tap]'
    return '[music: on]'
  }, [enabled, errored, audible])

  const toggle = () => {
    if (errored) return
    const a = audioRef.current
    if (!a) return

    if (!enabled) {
      setEnabled(true)
      tryPlayElement(a, errored, setAudible)
      return
    }

    if (!audible) {
      tryPlayElement(a, errored, setAudible)
      return
    }

    setEnabled(false)
    a.pause()
    setAudible(false)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={bgTrackUrl}
        loop
        preload="auto"
        playsInline
        onCanPlay={() => {
          setReady(true)
          setErrored(false)
        }}
        onLoadedData={() => setReady(true)}
        onError={() => setErrored(true)}
        onPlaying={() => setAudible(true)}
      />

      <div
        ref={musicUiRef}
        className="fixed bottom-4 right-4 z-[10002] flex items-center gap-3"
      >
        <div className="hidden items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-xs text-muted md:flex">
          <span className={!ready || !enabled ? 'opacity-60' : ''}>vol</span>
          <input
            aria-label="Music volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            disabled={!enabled || errored}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-28 accent-orange"
          />
        </div>

        <button
          type="button"
          onClick={toggle}
          className="rounded border border-border bg-surface px-4 py-2 text-sm text-offwhite transition-colors hover:border-orange hover:text-orange-bright focus-visible:ring-2 focus-visible:ring-orange-bright disabled:opacity-60"
          aria-label="Toggle background music"
          disabled={errored}
          title={
            errored
              ? 'Replace src/assets/bg.mp3 — failed to load'
              : !audible
                ? 'Tap boot screen or anywhere — then adjust vol if needed'
                : 'Music on — click to turn off'
          }
        >
          {label}
        </button>
      </div>
    </>
  )
}
