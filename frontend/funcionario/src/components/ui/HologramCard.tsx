import React from 'react'

interface HologramCardProps {
    children: React.ReactNode
    className?: string
}

const HologramCard: React.FC<HologramCardProps> = ({ children, className = '' }) => {
    return (
        <div
            className={`
                bg-coal-light/80 backdrop-blur-md
                border border-cyan-glow/30
                rounded-xl
                shadow-[inset_0_0_20px_rgba(0,255,240,0.05)]
                hover:border-cyan/50
                hover:shadow-[0_0_20px_rgba(0,255,240,0.2),inset_0_0_20px_rgba(0,255,240,0.1)]
                transition-all duration-300
                ${className}
            `}
        >
            {children}
        </div>
    )
}

export default HologramCard
