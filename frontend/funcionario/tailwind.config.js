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
                coal: '#0B0C10',
                charcoal: '#1F2833',
                'github-dark': '#0D1117',

                // Neon Tech Accents
                'neon-cyan': '#00FFF0',
                'tech-blue': '#0A84FF',
                'neon-purple': '#BF5AF2',
                'terminal-green': '#30D158',
                'alert-orange': '#FF9F0A',
                'critical-red': '#FF453A',

                // Metal
                'metal-silver': '#C5C6C7',
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
