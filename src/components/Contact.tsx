import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { getGsap, prefersReducedMotion } from '../lib/gsap'

const CONTACT_EMAIL = 'valerygonzalezrod@gmail.com'

function mailtoDirectLine(visitorName: string) {
  const subj = `Portfolio contact — ${visitorName.trim()}`
  const body = 'Hi Valery,\n\n'
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`
}

export default function Contact() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const reducedMotion = prefersReducedMotion()
  const [showEmail, setShowEmail] = useState(() => reducedMotion)
  const [showMessage, setShowMessage] = useState(() => reducedMotion)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (reducedMotion) return

    const { gsap } = getGsap()
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-contact-reveal]'))
    if (items.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [reducedMotion])

  const handleNameBlur = () => {
    if (name.trim()) setShowEmail(true)
  }
  const handleEmailBlur = () => {
    if (email.trim()) setShowMessage(true)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (submitting || submitted) return
    setSubmitting(true)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=Portfolio contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <section
      id="contact"
      data-stack-panel
      className="stack-panel scroll-mt-16 border border-border px-4 py-16 font-mono md:px-8 lg:px-12"
      aria-labelledby="contact-heading"
    >
      <div ref={wrapRef} className="stack-panel-inner mx-auto max-w-2xl">
        <h2
          id="contact-heading"
          className="font-display text-2xl text-orange md:text-3xl"
          data-contact-reveal
        >
          &gt; send_message
        </h2>
        <p className="mt-2 text-sm text-muted" data-contact-reveal>
          Direct email stays hidden until you enter your name below (fewer bots scraping
          the address). Then use the [email] link to open your mail app.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div data-contact-reveal>
              <label htmlFor="contact-name" className="block text-muted">
                Enter your name:
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                className="mt-1 w-full max-w-md border border-border bg-surface px-3 py-2 text-offwhite placeholder-muted focus:border-orange focus-visible:ring-2 focus-visible:ring-orange-bright"
                placeholder="____________"
                required
                autoComplete="name"
              />
            </div>

            {showEmail && (
              <div className="animate-[fadeIn_0.3s_ease-out]" data-contact-reveal>
                <label htmlFor="contact-email" className="block text-muted">
                  Enter your email:
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  className="mt-1 w-full max-w-md border border-border bg-surface px-3 py-2 text-offwhite placeholder-muted focus:border-orange focus-visible:ring-2 focus-visible:ring-orange-bright"
                  placeholder="____________"
                  required
                  autoComplete="email"
                />
              </div>
            )}

            {showMessage && (
              <div className="animate-[fadeIn_0.3s_ease-out]" data-contact-reveal>
                <label htmlFor="contact-message" className="block text-muted">
                  Your message:
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="mt-1 w-full max-w-md border border-border bg-surface px-3 py-2 text-offwhite placeholder-muted focus:border-orange focus-visible:ring-2 focus-visible:ring-orange-bright"
                  placeholder="____________"
                  required
                />
              </div>
            )}

            {(showEmail && showMessage) && (
              <button
                type="submit"
                disabled={submitting}
                className="rounded border border-orange bg-surface px-4 py-2 text-orange transition-colors hover:bg-orange hover:text-bg focus-visible:ring-2 focus-visible:ring-orange-bright disabled:opacity-50"
                aria-label="Send message"
                data-contact-reveal
              >
                &gt; [send_message ↵]
              </button>
            )}
          </form>
        ) : (
          <div className="mt-8 space-y-2 text-offwhite" data-contact-reveal>
            <p className="text-orange">✓ Thanks — you&apos;re all set.</p>
            <p className="text-muted">
              Your mail app should open with a draft. Send when you&apos;re ready.
              <br />
              -- Valery
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4" data-contact-reveal>
          <a
            href="https://github.com/valerythedev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-bright hover:underline focus-visible:ring-2 focus-visible:ring-orange-bright"
            aria-label="GitHub"
          >
            [github]
          </a>
          <a
            href="https://www.linkedin.com/in/valery-gonzalez/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-bright hover:underline focus-visible:ring-2 focus-visible:ring-orange-bright"
            aria-label="LinkedIn"
          >
            [linkedin]
          </a>
          {name.trim() ? (
            <a
              href={mailtoDirectLine(name)}
              className="text-orange-bright hover:underline focus-visible:ring-2 focus-visible:ring-orange-bright"
              aria-label="Open email to Valery in your mail app"
            >
              [email]
            </a>
          ) : (
            <span
              className="cursor-not-allowed text-muted"
              aria-label="Enter your name in the form above to unlock email"
              title="Type your name in the form first"
            >
              [email — locked]
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
