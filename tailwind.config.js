/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1a1a1a',
        surface: '#222222',
        border: '#2e2e2e',
        orange: '#803409',
        'orange-bright': '#a0450c',
        offwhite: '#e8e4dc',
        muted: '#7a7570',
        cursor: '#803409',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['VT323', 'monospace'],
      },
    },
  },
  plugins: [],
}

