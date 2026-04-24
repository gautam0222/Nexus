import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── App surfaces ────────────────────────────────────────────
        app:      '#1a1d21',   // outermost bg
        sidebar:  '#19171d',   // sidebar bg
        surface:  '#222529',   // cards, inputs
        hover:    '#2b2d31',   // hover state
        active:   '#35373c',   // pressed/selected
        // ── Borders ─────────────────────────────────────────────────
        line:     'rgba(255,255,255,0.08)',
        'line-2': 'rgba(255,255,255,0.14)',
        // ── Text ────────────────────────────────────────────────────
        hi:       '#e3e5e8',   // high-contrast text
        lo:       '#949ba4',   // secondary text
        dim:      '#616a75',   // muted / placeholder
        // ── Brand / accent ──────────────────────────────────────────
        brand:    '#5865f2',   // indigo accent
        'brand-h':'#4752c4',   // brand hover
        // ── Status ──────────────────────────────────────────────────
        online:   '#23a55a',
        busy:     '#f0b232',
        away:     '#f0b23280',
        offline:  '#80848e',
        // ── Semantic ────────────────────────────────────────────────
        danger:   '#e04141',
        success:  '#23a55a',
        warn:     '#f0b232',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
        xs:    ['11px', { lineHeight: '16px' }],
        sm:    ['12px', { lineHeight: '18px' }],
        base:  ['13px', { lineHeight: '20px' }],
        md:    ['14px', { lineHeight: '22px' }],
        lg:    ['15px', { lineHeight: '24px' }],
      },
      spacing: {
        sidebar: '260px',
      },
      animation: {
        'fade-in':  'fadeIn 0.1s ease-out',
        'slide-up': 'slideUp 0.12s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                              to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
} satisfies Config
