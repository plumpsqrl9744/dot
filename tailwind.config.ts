import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Blue (Accent)
        primary: {
          DEFAULT: '#007AFF',
          hover: '#0066DD'
        },

        // Supporting Blues
        blue: {
          mid: '#5494F3',
          light: '#E3F2FD'
        },

        // Base/Neutrals
        white: '#FFFFFF',
        border: '#DADCE0',
        text: {
          DEFAULT: 'var(--text-primary)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          placeholder: 'var(--text-placeholder)',
        },
        placeholder: '#80868B',

        // Feedback Colors
        success: '#22C55E',
        warning: '#F97316',
        error: '#EF4444',

        // Sidebar
        sidebar: {
          DEFAULT: '#1a1d21',
          hover: '#27292d',
          active: '#1164A3',
          text: '#D1D2D3',
          'text-muted': '#9EA0A3'
        }
      },
      boxShadow: {
        dot: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'dot-lg': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
      }
    }
  },
  plugins: []
}

export default config
