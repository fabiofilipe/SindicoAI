import type { HTMLAttributes } from 'react'

interface HologramCardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean
    glow?: boolean
}

const HologramCard = ({
    children,
    hover = true,
    glow = true,
    className = '',
    ...props
}: HologramCardProps) => {
    const hoverClass = hover ? 'hover:border-cyan/50 hover:shadow-glow-sm' : ''
    const glowClass = glow ? 'shadow-[inset_0_0_20px_rgba(0,255,240,0.05)]' : ''

    return (
        <div
            className={`
                bg-coal-light/80
                backdrop-blur-md
                border border-cyan-glow/30
                rounded-xl
                ${glowClass}
                ${hoverClass}
                transition-all duration-300
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    )
}

export default HologramCard
