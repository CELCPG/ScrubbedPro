import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0F2D5E', light: '#1a4080', dark: '#091e44' },
        blue: { DEFAULT: '#2E75B6', light: '#D6E4F7', dark: '#1f5388' },
        sky: '#D6E4F7',
        safe: { DEFAULT: '#1D6A3A', light: '#E2F0E7' },
        risk: { DEFAULT: '#B45309', light: '#FEF3C7' },
        critical: { DEFAULT: '#991B1B', light: '#FEE2E2' },
        surface: '#F5F6F8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config