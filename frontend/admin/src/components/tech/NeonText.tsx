import { ReactNode } from 'react'

interface NeonTextProps {
    children: ReactNode
    color?: 'cyan' | 'blue' | 'purple' | 'green'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

const colorClasses = {
    cyan: 'text-cyan text-glow-cyan',
    blue: 'text-techblue text-glow-blue',
    purple: 'text-neonpurple text-glow-purple',
    green: 'text-terminalgreen',
}

const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-4xl',
}

const NeonText = ({ children, color = 'cyan', size = 'md', className = '' }: NeonTextProps) => {
    return (
        <span className={`font-bold ${colorClasses[color]} ${sizeClasses[size]} ${className}`}>
            {children}
        </span>
    )
}

export default NeonText
