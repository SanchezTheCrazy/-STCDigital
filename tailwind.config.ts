import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e2c87a',
          dark: '#9a7a2f',
        },
        surface: {
          DEFAULT: '#161616',
          alt: '#1c1c1c',
          muted: '#111111',
          deep: '#0d0d0d',
        },
        border: {
          DEFAULT: '#2e2e2e',
          muted: '#1c1c1c',
          faint: '#111111',
        },
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [],
}

export default config
