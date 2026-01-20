/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces (Backgrounds)
        marble: '#FAF9F6',
        champagne: '#F5F0E6',
        cream: '#FFFDF8',
        parchment: '#F8F6F0',

        // Foreground (Text)
        ink: '#1C1917',
        graphite: '#44403C',
        stone: '#78716C',
        silver: '#A8A29E',

        // Accent (Brand) - Signature Latão
        brass: '#B8860B',
        'brass-light': '#D4A84B',
        'brass-dark': '#8B6914',
        walnut: '#3D2B1F',

        // Semantic
        garden: '#1B4332',
        'garden-light': '#2D6A4F',
        cognac: '#9A3412',
        burgundy: '#7F1D1D',
        sapphire: '#1E40AF',

        // Borders
        'border-light': '#E7E5E4',
        'border-medium': '#D6D3D1',
        'border-brass': '#B8860B',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'soft-sm': '0 1px 2px rgba(28, 25, 23, 0.05)',
        'soft': '0 1px 3px rgba(28, 25, 23, 0.1), 0 1px 2px rgba(28, 25, 23, 0.06)',
        'soft-md': '0 4px 6px rgba(28, 25, 23, 0.07), 0 2px 4px rgba(28, 25, 23, 0.06)',
        'soft-lg': '0 10px 15px rgba(28, 25, 23, 0.1), 0 4px 6px rgba(28, 25, 23, 0.05)',
        'soft-xl': '0 20px 25px rgba(28, 25, 23, 0.1), 0 10px 10px rgba(28, 25, 23, 0.04)',
        'brass': '0 4px 14px rgba(184, 134, 11, 0.15)',
        'brass-lg': '0 8px 24px rgba(184, 134, 11, 0.2)',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #FAF9F6 0%, #F5F0E6 100%)',
        'gradient-brass': 'linear-gradient(135deg, #B8860B 0%, #D4A84B 100%)',
        'gradient-walnut': 'linear-gradient(180deg, #3D2B1F 0%, #2C1F16 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'elegant': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
