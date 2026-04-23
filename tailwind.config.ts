import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nx: {
          // ── Depth layers (darkest to lightest) ──────────────────
          void:    '#07070E',       // outermost shell
          base:    '#0C0C16',       // page bg
          surface: '#11111F',       // panels (rail, sidebar)
          raised:  '#171728',       // elevated cards
          overlay: '#1D1D32',       // interactive hover bg
          float:   '#24243E',       // dropdowns, tooltips

          // ── Hairline borders ────────────────────────────────────
          line:  'rgba(255,255,255,0.045)',   // barely there
          edge:  'rgba(255,255,255,0.08)',    // visible separator
          focus: 'rgba(124,58,237,0.50)',     // focus ring

          // ── Text hierarchy ──────────────────────────────────────
          primary:   '#ECEEFF',   // warm white with blue tint
          secondary: '#7E7EA8',   // comfortable reading gray
          muted:     '#4A4A6A',   // de-emphasized labels
          ghost:     '#28284A',   // barely visible

          // ── Brand: electric violet ──────────────────────────────
          violet:        '#8B5CF6',
          'violet-hi':   '#A78BFA',
          'violet-lo':   '#6D28D9',
          'violet-dim':  'rgba(139,92,246,0.10)',
          'violet-glow': 'rgba(139,92,246,0.30)',

          // ── Semantic ────────────────────────────────────────────
          green:  '#22C55E',
          red:    '#F43F5E',
          amber:  '#F59E0B',
          cyan:   '#06B6D4',
          'red-dim': 'rgba(244,63,94,0.12)',

          // ── Legacy aliases so old code doesn't break ────────────
          bg:           '#0C0C16',
          graphite:     '#11111F',
          cream:        '#ECEEFF',
          indigo:       '#8B5CF6',
          'indigo-d':   '#6D28D9',
          'indigo-l':   '#A78BFA',
          'indigo-muted': 'rgba(139,92,246,0.10)',
          border:       'rgba(255,255,255,0.045)',
          border2:      'rgba(255,255,255,0.08)',
          subtle:       '#4A4A6A',
          mint:         '#06B6D4',
          surface2:     '#1D1D32',
          surface3:     '#24243E',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.01em' }],
        xs:   ['11px', { lineHeight: '16px' }],
        sm:   ['12px', { lineHeight: '18px' }],
        base: ['13px', { lineHeight: '20px' }],
        md:   ['14px', { lineHeight: '22px' }],
        lg:   ['15px', { lineHeight: '24px' }],
        xl:   ['17px', { lineHeight: '26px' }],
        '2xl':['20px', { lineHeight: '28px' }],
      },
      spacing: {
        rail:    '52px',
        sidebar: '236px',
        panel:   '280px',
      },
      borderRadius: {
        sm:      '4px',
        DEFAULT: '6px',
        md:      '8px',
        lg:      '10px',
        xl:      '14px',
        '2xl':   '18px',
        '3xl':   '24px',
        '4xl':   '32px',
      },
      boxShadow: {
        // Glow system
        'glow-v':   '0 0 0 1px rgba(139,92,246,0.35), 0 0 20px rgba(139,92,246,0.18)',
        'glow-sm':  '0 2px 12px rgba(0,0,0,0.55)',
        'glow-md':  '0 8px 32px rgba(0,0,0,0.70), inset 0 1px 0 rgba(255,255,255,0.04)',
        'glow-lg':  '0 16px 56px rgba(0,0,0,0.80)',
        // Float / panel
        float:      '0 0 0 1px rgba(255,255,255,0.055), 0 20px 60px rgba(0,0,0,0.75)',
        panel:      '1px 0 0 rgba(255,255,255,0.045)',
        'inner-top':'inset 0 1px 0 rgba(255,255,255,0.05)',
        // Legacy
        'glow-indigo': '0 0 0 2px rgba(139,92,246,0.40)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        snappy: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      },
      animation: {
        'fade-in':    'fadeIn 0.12s ease-out',
        'slide-up':   'slideUp 0.16s cubic-bezier(0.4,0,0.2,1)',
        'slide-right':'slideRight 0.18s cubic-bezier(0.4,0,0.2,1)',
        'scale-in':   'scaleIn 0.14s cubic-bezier(0.34,1.56,0.64,1)',
        'pulse-dot':  'pulseDot 2.5s ease-in-out infinite',
        'badge-pop':  'badgePop 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { transform: 'translateY(6px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideRight:{ from: { transform: 'translateX(-6px)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
        scaleIn:   { from: { transform: 'scale(0.93)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
        pulseDot:  { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.4', transform: 'scale(0.8)' } },
        badgePop:  { from: { transform: 'scale(0.5)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
      },
    },
  },
  plugins: [],
} satisfies Config
