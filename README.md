# VLGR Portfolio

Personal portfolio (Vite + React + TypeScript + Tailwind + GSAP).

## Setup

```bash
npm install
cp .env.example .env   # optional — set VITE_SITE_URL for production builds
npm run dev
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_SITE_URL` | Canonical URL **without** trailing slash (Open Graph, Twitter Card, JSON-LD). Defaults to `http://localhost:5173` in `vite.config.ts` when unset. Set this on your host for production builds. |

Add `VITE_SITE_URL` in Vercel/Netlify/etc. under **Environment variables** for Production.

## Production build

```bash
npm run build
npm run preview
```

## Deploy notes

- **SPA**: Configure the host to serve `index.html` for unknown paths (fallback).
- **Resume**: When ready, add `public/resume.pdf` and a `[./resume.pdf]` link in the Hero (currently omitted until you have the PDF).
- **Social preview**: `public/og-image.png` is used for OG/Twitter. For best shares, use a **1200×630** image.

Contact uses **mailto** from the form (no third-party form backend).

## Lint

```bash
npm run lint
```
