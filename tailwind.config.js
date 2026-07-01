/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mentor: {
          cream:    '#FAF7F2',
          'cream-dark': '#F0EBE1',
          navy:     '#1A2744',
          'navy-light': '#2D3F6B',
          'navy-dim': '#0F1A30',
          amber:    '#D97706',
          'amber-light': '#F59E0B',
          'amber-pale': '#FEF3C7',
          sage:     '#4D7C5E',
          'sage-light': '#6EAD82',
          'sage-pale': '#D1FAE5',
          mint:     '#0D9488',
          'mint-pale': '#CCFBF1',
          red:      '#DC2626',
          'red-pale': '#FEE2E2',
          tan:      '#8B7355',
          'tan-light': '#BFA98A',
          surface:  '#FFFFFF',
          border:   '#E5DDD0',
          text:     '#1A2744',
          muted:    '#6B7280',
          physics:  '#3B82F6',
          chemistry:'#8B5CF6',
          maths:    '#059669',
          cs:       '#F59E0B',
          english:  '#EC4899',
        },
        brand: {
          bg: '#0A0A0F',
          surface: '#12121A',
          border: '#1E1E2E',
          violet: '#7C3AED',
          'violet-light': '#9D5FF5',
          'violet-dim': '#3D1A7A',
          cyan: '#06B6D4',
          'cyan-dim': '#0E4F5C',
          text: '#F1F5F9',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Source Serif 4', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Space Grotesk', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'count-up': 'countUp 2s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        md: '12px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
