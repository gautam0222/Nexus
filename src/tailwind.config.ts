import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nx: {
          // Backgrounds - layered depth system
          bg: '#0F1117',
          graphite: '#1A1D27',
          surface: '#252836',
          surface2: '#2E3245',
          surface3: '#353850',

          // Borders
          border: '#2A2D3E',
          border2: '#3D4160',

          // Brand
          indigo: '#6366F1',
          'indigo-d': '#4F46E5',
          'indigo-l': '#818CF8',
          'indigo-muted': '#6366F118',

          // Status
          mint: '#22D3A5',
          amber: '#F59E0B',
          red: '#F43F5E',

          // Text
          cream: '#F1F0EC',
          muted: '#8B8A84',
          subtle: '#4B4D5E',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
        xs: ['11px', { lineHeight: '16px' }],
        sm: ['12px', { lineHeight: '18px' }],
        base: ['13px', { lineHeight: '20px' }],
        md: ['14px', { lineHeight: '22px' }],
        lg: ['15px', { lineHeight: '24px' }],
        xl: ['17px', { lineHeight: '26px' }],
        '2xl': ['20px', { lineHeight: '28px' }],
      },
      spacing: {
        rail: '64px',
        sidebar: '260px',
        panel: '280px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'glow-indigo': '0 0 0 2px #6366F140',
        'glow-sm': '0 2px 8px rgba(0,0,0,0.4)',
        'glow-md': '0 4px 20px rgba(0,0,0,0.5)',
        panel: '4px 0 24px rgba(0,0,0,0.3)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-right': 'slideRight 0.2s cubic-bezier(0.4,0,0.2,1)',
        'slide-up': 'slideUp 0.2s cubic-bezier(0.4,0,0.2,1)',
        'scale-in': 'scaleIn 0.15s cubic-bezier(0.4,0,0.2,1)',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideRight: {
          from: { transform: 'translateX(-12px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
