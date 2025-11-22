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
                'neon-cyan': '#00FFF0',
                techblue: '#0A84FF',
                'tech-blue': '#0A84FF',
                purple: '#AF52DE',
                'neon-purple': '#BF5AF2',

                // Status Colors
                terminalgreen: '#30D158',
                'terminal-green': '#30D158',
                alertorange: '#FF9F0A',
                'alert-orange': '#FF9F0A',
                criticalred: '#FF453A',
                'critical-red': '#FF453A',

                // Neutral Tech
                'metal-silver': '#C7C7CC',
                'metal-dark': '#48484A',
                'metal-gold': '#FFD60A',
            },
            boxShadow: {
                'glow-cyan': '0 0 20px rgba(0, 255, 240, 0.5)',
                'glow-blue': '0 0 20px rgba(10, 132, 255, 0.5)',
                'glow-green': '0 0 20px rgba(48, 209, 88, 0.5)',
                'glow-red': '0 0 20px rgba(255, 69, 58, 0.5)',
            },
            backgroundImage: {
                'gradient-cyber': 'linear-gradient(135deg, #00FFF0 0%, #0A84FF 100%)',
                'gradient-industrial': 'linear-gradient(135deg, #1F2833 0%, #0B0C10 100%)',
            },
        },
    },
    plugins: [],
}
