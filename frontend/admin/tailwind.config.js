/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base Colors (Industrial Dark)
        coal: '#0B0C10',
        'coal-light': '#1F2833',
        charcoal: '#2C3E50',

        // Accent Colors (Tech Neon)
        cyan: '#00FFF0',
        'cyan-glow': '#00FFF0',
        techblue: '#0A84FF',
        purple: '#AF52DE',

        // Status Colors
        terminalgreen: '#30D158',
        alertorange: '#FF9F0A',
        criticalred: '#FF453A',

        // Neutral Tech
        'metal-silver': '#C7C7CC',
        'metal-dark': '#48484A',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Menlo', 'Monaco', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #00FFF0 0%, #0A84FF 100%)',
        'gradient-industrial': 'linear-gradient(135deg, #1F2833 0%, #0B0C10 100%)',
        'gradient-alert': 'linear-gradient(135deg, #FF453A 0%, #FF9F0A 100%)',
        'tech-grid': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300FFF0' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 255, 240, 0.5)',
        'glow-sm': '0 0 10px rgba(0, 255, 240, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 255, 240, 0.6)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 240, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 240, 0.8)' },
        },
        'scan': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
