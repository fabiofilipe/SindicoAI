/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base Colors - Deep Industrial
        coal: {
          DEFAULT: '#0B0C10',
          light: '#1F2833',
          dark: '#0D1117',
        },
        charcoal: '#1F2833',
        github: '#0D1117',

        // Accent Colors - Neon Tech
        cyan: {
          DEFAULT: '#00FFF0',
          glow: 'rgba(0, 255, 240, 0.3)',
        },
        techblue: '#0A84FF',
        neonpurple: '#BF5AF2',
        terminalgreen: '#30D158',
        alertorange: '#FF9F0A',
        criticalred: '#FF453A',

        // Industrial Accents
        metal: {
          silver: '#C5C6C7',
          gold: '#FFD60A',
        },

        // Border
        'border-glow': 'rgba(0, 255, 240, 0.3)',
        'grid-color': 'rgba(0, 255, 240, 0.1)',
      },

      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #00FFF0 0%, #0A84FF 100%)',
        'gradient-industrial': 'linear-gradient(135deg, #1F2833 0%, #0B0C10 100%)',
        'gradient-metal': 'linear-gradient(135deg, #C5C6C7 0%, #66FCF1 50%, #C5C6C7 100%)',
        'gradient-alert': 'linear-gradient(135deg, #FF453A 0%, #FF9F0A 100%)',
      },

      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Menlo', 'Monaco', 'monospace'],
        tech: ['Orbitron', 'sans-serif'],
      },

      boxShadow: {
        'glow-sm': '0 0 5px rgba(0, 255, 240, 0.5)',
        'glow': '0 0 10px rgba(0, 255, 240, 0.5)',
        'glow-md': '0 0 20px rgba(0, 255, 240, 0.5)',
        'glow-lg': '0 0 30px rgba(0, 255, 240, 0.5)',
        'glow-cyan': '0 0 20px rgba(0, 255, 240, 0.8)',
        'glow-blue': '0 0 20px rgba(10, 132, 255, 0.8)',
        'glow-purple': '0 0 20px rgba(191, 90, 242, 0.8)',
      },

      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'data-stream': 'data-stream 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },

      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 240, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 240, 0.8)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'shimmer': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'data-stream': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '50%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(20px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
