import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nx: {
          // ── Backgrounds ───────────────────────────────────────────
          base:    '#0F0F12',   // app bg
          subtle:  '#141416',   // rail + sidebar
          panel:   '#1A1A1D',   // cards, elevated surfaces
          hover:   '#222226',   // interactive hover
          active:  '#2A2A30',   // pressed / selected bg
          overlay: '#222226',   // dropdown overlay

          // ── Borders ────────────────────────────────────────────────
          border:  'rgba(255,255,255,0.07)',
          border2: 'rgba(255,255,255,0.12)',

          // ── Text ───────────────────────────────────────────────────
          primary:   '#EAEAEA',   // headings, key text
          secondary: '#888888',   // body text
          muted:     '#555555',   // labels
          ghost:     '#333333',   // barely visible

          // ── Accent (single, clean indigo) ─────────────────────────
          accent:         '#5C5CDB',
          'accent-hover': '#6D6DE0',
          'accent-lo':    '#4444B8',
          'accent-dim':   'rgba(92,92,219,0.12)',
          'accent-ring':  'rgba(92,92,219,0.35)',

          // ── Semantic ───────────────────────────────────────────────
          green:          '#3DD68C',
          red:            '#E5484D',
          amber:          '#F1A10D',
          'red-dim':      'rgba(229,72,77,0.12)',

          // ── Legacy aliases (don't break existing code) ─────────────
          bg:             '#0F0F12',
          graphite:       '#141416',
          cream:          '#EAEAEA',
          indigo:         '#5C5CDB',
          'indigo-d':     '#4444B8',
          'indigo-l':     '#7878E0',
          'indigo-muted': 'rgba(92,92,219,0.12)',
          mint:           '#3DD68C',
          surface2:       '#222226',
          surface3:       '#2A2A30',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.01em' }],
        xs:   ['11px', { lineHeight: '16px' }],
        sm:   ['12px', { lineHeight: '18px', letterSpacing: '-0.01em' }],
        base: ['13px', { lineHeight: '20px', letterSpacing: '-0.01em' }],
        md:   ['14px', { lineHeight: '22px', letterSpacing: '-0.01em' }],
        lg:   ['15px', { lineHeight: '24px', letterSpacing: '-0.015em' }],
        xl:   ['17px', { lineHeight: '26px', letterSpacing: '-0.02em' }],
        '2xl':['20px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
      },
      spacing: {
        rail:    '56px',
        sidebar: '240px',
        panel:   '280px',
      },
      borderRadius: {
        sm:    '4px',
        DEFAULT:'6px',
        md:    '8px',
        lg:    '10px',
        xl:    '14px',
        '2xl': '18px',
      },
      boxShadow: {
        popup:    '0 0 0 1px rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.60)',
        panel:    '0 0 0 1px rgba(255,255,255,0.06)',
        'sm':     '0 2px 8px rgba(0,0,0,0.40)',
        'md':     '0 4px 20px rgba(0,0,0,0.55)',
        // Legacy
        'glow-sm': '0 2px 8px rgba(0,0,0,0.40)',
        'glow-md': '0 4px 20px rgba(0,0,0,0.55)',
        'glow-indigo': '0 0 0 2px rgba(92,92,219,0.35)',
        'glow-v':      '0 0 0 1px rgba(92,92,219,0.30)',
        'inner-top':   'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      animation: {
        'fade-in':    'fadeIn 0.12s ease-out',
        'slide-up':   'slideUp 0.15s ease-out',
        'slide-right':'slideIn 0.15s ease-out',
        'scale-in':   'scaleIn 0.12s cubic-bezier(0.34,1.56,0.64,1)',
        'pulse-dot':  'pulseDot 2s ease-in-out infinite',
        'badge-pop':  'badgePop 0.18s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        fadeIn:   { from:{opacity:'0'},                                             to:{opacity:'1'} },
        slideUp:  { from:{transform:'translateY(6px)',opacity:'0'},                 to:{transform:'translateY(0)',opacity:'1'} },
        slideIn:  { from:{transform:'translateX(-6px)',opacity:'0'},                to:{transform:'translateX(0)',opacity:'1'} },
        scaleIn:  { from:{transform:'scale(0.93)',opacity:'0'},                     to:{transform:'scale(1)',opacity:'1'} },
        pulseDot: { '0%,100%':{opacity:'1',transform:'scale(1)'}, '50%':{opacity:'0.4',transform:'scale(0.75)'} },
        badgePop: { from:{transform:'scale(0.5)',opacity:'0'},                      to:{transform:'scale(1)',opacity:'1'} },
      },
    },
  },
  plugins: [],
} satisfies Config
