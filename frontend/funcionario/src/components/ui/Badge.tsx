import React from 'react'

interface BadgeProps {
    children: React.ReactNode
    variant: 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'pending'
    pulse?: boolean
}

const Badge: React.FC<BadgeProps> = ({ children, variant, pulse = false }) => {
    const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold'

    const variantStyles = {
        confirmed: 'bg-terminal-green/20 text-terminal-green border border-terminal-green',
        'in-progress': `bg-neon-cyan/20 text-neon-cyan border border-neon-cyan ${pulse ? 'animate-pulse' : ''}`,
        completed: 'bg-metal-silver/20 text-metal-silver border border-metal-silver',
        cancelled: 'bg-critical-red/20 text-critical-red border border-critical-red',
        pending: 'bg-alert-orange/20 text-alert-orange border border-alert-orange',
    }

    return (
        <span className={`${baseStyles} ${variantStyles[variant]}`}>
            {children}
        </span>
    )
}

export default Badge
