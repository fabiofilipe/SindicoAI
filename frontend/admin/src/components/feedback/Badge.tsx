import { ReactNode } from 'react'

interface BadgeProps {
    children: ReactNode
    variant?: 'success' | 'warning' | 'error' | 'active' | 'inactive' | 'info'
    neonGlow?: boolean
    pulse?: boolean
    className?: string
}

const Badge = ({
    children,
    variant = 'info',
    neonGlow = false,
    pulse = false,
    className = ''
}: BadgeProps) => {
    const variants = {
        success: 'bg-terminalgreen/20 text-terminalgreen border-terminalgreen',
        warning: 'bg-alertorange/20 text-alertorange border-alertorange',
        error: 'bg-criticalred/20 text-criticalred border-criticalred',
        active: 'bg-cyan/20 text-cyan border-cyan',
        inactive: 'bg-metal-silver/20 text-metal-silver border-metal-silver',
        info: 'bg-techblue/20 text-techblue border-techblue',
    }

    const glowClass = neonGlow ? 'shadow-glow-sm' : ''
    const pulseClass = pulse ? 'animate-pulse-glow' : ''

    return (
        <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${variants[variant]} ${glowClass} ${pulseClass} ${className}
    `}>
            {children}
        </span>
    )
}

export default Badge
