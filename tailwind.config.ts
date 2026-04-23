import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nx: {
          // ── Void blacks ────────────────────────────────────────
          void:    '#01010A',
          base:    '#07071A',
          card:    '#0D0D25',
          lift:    '#121230',
          overlay: '#191935',
          float:   '#202048',

          // ── NEON PINK (primary) ────────────────────────────────
          pink:        '#FF0055',
          'pink-hi':   '#FF4488',
          'pink-lo':   '#CC0044',
          'pink-dim':  'rgba(255,0,85,0.12)',
          'pink-glow': 'rgba(255,0,85,0.30)',

          // ── ELECTRIC CYAN ──────────────────────────────────────
          cyan:        '#00EEFF',
          'cyan-hi':   '#55F5FF',
          'cyan-lo':   '#00AABB',
          'cyan-dim':  'rgba(0,238,255,0.10)',
          'cyan-glow': 'rgba(0,238,255,0.28)',

          // ── ACID LIME ──────────────────────────────────────────
          lime:        '#BBFF00',
          'lime-hi':   '#CCFF33',
          'lime-dim':  'rgba(187,255,0,0.10)',
          'lime-glow': 'rgba(187,255,0,0.25)',

          // ── NEON PURPLE ────────────────────────────────────────
          purple:        '#9D00FF',
          'purple-hi':   '#BB55FF',
          'purple-dim':  'rgba(157,0,255,0.12)',
          'purple-glow': 'rgba(157,0,255,0.28)',

          // ── NEON AMBER ─────────────────────────────────────────
          amber:        '#FF8800',
          'amber-dim':  'rgba(255,136,0,0.12)',
          'amber-glow': 'rgba(255,136,0,0.28)',

          // ── TEXT ───────────────────────────────────────────────
          white:  '#FFFFFF',
          fog:    '#9898C0',
          dim:    '#44446A',
          ghost:  '#1C1C40',

          // ── BORDERS (cyan tinted) ──────────────────────────────
          line:   'rgba(0,238,255,0.05)',
          edge:   'rgba(0,238,255,0.10)',
          hot:    'rgba(255,0,85,0.25)',

          // ── LEGACY ALIASES ─────────────────────────────────────
          bg:           '#07071A',
          graphite:     '#0D0D25',
          cream:        '#FFFFFF',
          indigo:       '#9D00FF',
          'indigo-d':   '#7700CC',
          'indigo-l':   '#BB55FF',
          'indigo-muted':'rgba(157,0,255,0.12)',
          border:       'rgba(0,238,255,0.05)',
          border2:      'rgba(0,238,255,0.10)',
          subtle:       '#44446A',
          mint:         '#00EEFF',
          surface2:     '#191935',
          surface3:     '#202048',
          muted:        '#44446A',
          primary:      '#FFFFFF',
          secondary:    '#9898C0',
          red:          '#FF0055',
          green:        '#00EEFF',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
        xs:   ['11px', { lineHeight: '16px' }],
        sm:   ['12px', { lineHeight: '18px' }],
        base: ['13px', { lineHeight: '20px' }],
        md:   ['14px', { lineHeight: '22px' }],
        lg:   ['15px', { lineHeight: '24px' }],
        xl:   ['17px', { lineHeight: '26px' }],
        '2xl':['20px', { lineHeight: '28px' }],
      },
      spacing: {
        rail:    '48px',
        sidebar: '220px',
        panel:   '280px',
      },
      borderRadius: {
        sm:    '3px',
        DEFAULT:'5px',
        md:    '8px',
        lg:    '10px',
        xl:    '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        'neon-pink':  '0 0 0 1px rgba(255,0,85,0.55), 0 0 20px rgba(255,0,85,0.30)',
        'neon-cyan':  '0 0 0 1px rgba(0,238,255,0.55), 0 0 20px rgba(0,238,255,0.28)',
        'neon-purple':'0 0 0 1px rgba(157,0,255,0.55), 0 0 20px rgba(157,0,255,0.28)',
        'neon-lime':  '0 0 0 1px rgba(187,255,0,0.50), 0 0 20px rgba(187,255,0,0.20)',
        'glow-sm':    '0 4px 20px rgba(0,0,0,0.75)',
        'glow-md':    '0 8px 40px rgba(0,0,0,0.85)',
        float:        '0 0 0 1px rgba(0,238,255,0.10), 0 20px 60px rgba(0,0,0,0.90)',
        'glow-indigo':'0 0 0 2px rgba(157,0,255,0.40)',
        'glow-v':     '0 0 0 1px rgba(157,0,255,0.40), 0 0 20px rgba(157,0,255,0.20)',
        panel:        '1px 0 0 rgba(0,238,255,0.06)',
        'inner-top':  'inset 0 1px 0 rgba(255,255,255,0.04)',
        'glow-indigo2':'0 0 0 2px rgba(0,238,255,0.40)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in':    'fadeIn 0.12s ease-out',
        'slide-up':   'slideUp 0.16s ease-out',
        'slide-right':'slideRight 0.18s ease-out',
        'scale-in':   'scaleIn 0.14s cubic-bezier(0.34,1.56,0.64,1)',
        'msg-in':     'msgIn 0.18s cubic-bezier(0.34,1.20,0.64,1)',
        'badge-pop':  'badgePop 0.20s cubic-bezier(0.34,1.56,0.64,1)',
        'pulse-dot':  'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity:'0' }, to: { opacity:'1' } },
        slideUp:   { from: { transform:'translateY(8px)', opacity:'0' }, to: { transform:'translateY(0)', opacity:'1' } },
        slideRight:{ from: { transform:'translateX(-8px)', opacity:'0' }, to: { transform:'translateX(0)', opacity:'1' } },
        scaleIn:   { from: { transform:'scale(0.92)', opacity:'0' }, to: { transform:'scale(1)', opacity:'1' } },
        msgIn:     { from: { transform:'translateX(-10px) scale(0.98)', opacity:'0' }, to: { transform:'translateX(0) scale(1)', opacity:'1' } },
        badgePop:  { from: { transform:'scale(0.5)', opacity:'0' }, to: { transform:'scale(1)', opacity:'1' } },
        pulseDot:  { '0%,100%': { opacity:'1', transform:'scale(1)' }, '50%': { opacity:'0.4', transform:'scale(0.75)' } },
      },
    },
  },
  plugins: [],
} satisfies Config
