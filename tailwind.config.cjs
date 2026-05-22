/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        foreground: '#e2e8f0',
        surface:    '#1e293b',
        muted:      '#64748b',
        accent:     '#22d3ee',
        line:       '#1e293b',
        'line-soft':'#0f172a',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono:  ['"Berkeley Mono"', '"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};