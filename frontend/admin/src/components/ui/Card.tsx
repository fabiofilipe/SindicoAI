import { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    variant?: 'holographic' | 'solid' | 'terminal'
    borderGlow?: boolean
    className?: string
}

const Card = ({
    children,
    variant = 'holographic',
    borderGlow = false,
    className = ''
}: CardProps) => {
    const variants = {
        holographic: 'card-holographic',
        solid: 'bg-coal-light border border-metal-silver/20',
        terminal: 'bg-coal border border-terminalgreen/50 font-mono',
    }

    const glowClass = borderGlow ? 'border-animate' : ''

    return (
        <div className={`${variants[variant]} ${glowClass} ${className}`}>
            {children}
        </div>
    )
}

export default Card
