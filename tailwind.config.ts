import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Blue (Accent)
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)'
        },

        // Supporting Blues
        blue: {
          mid: '#5494F3',
          light: '#E3F2FD'
        },

        // Base/Neutrals
        white: 'var(--bg-default)',
        border: 'var(--border-default)',
        text: {
          DEFAULT: 'var(--text-primary)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          placeholder: 'var(--text-placeholder)',
          muted: 'var(--text-muted)'
        },

        // Backgrounds
        bg: {
          DEFAULT: 'var(--bg-default)',
          secondary: 'var(--bg-secondary)',
          hover: 'var(--bg-hover)'
        },

        // Feedback Colors
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)'
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
