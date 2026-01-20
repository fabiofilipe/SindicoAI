import type { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    hover?: boolean
    animate?: boolean
    delay?: number
    variant?: 'default' | 'signature'
}

const Card = ({
    children,
    className = '',
    hover = false,
    animate = true,
    delay = 0,
    variant = 'default'
}: CardProps) => {
    const variants = {
        default: 'bg-cream border border-border-light shadow-soft',
        signature: 'bg-cream border border-border-brass shadow-soft-md',
    }

    const hoverClasses = hover
        ? variant === 'signature'
            ? 'hover:border-brass-light hover:shadow-brass hover:-translate-y-0.5 transition-all duration-200'
            : 'hover:border-border-medium hover:shadow-soft-md hover:-translate-y-0.5 transition-all duration-200'
        : ''

    const animateClasses = animate
        ? `animate-in fade-in slide-in-from-bottom-5 duration-400`
        : ''

    return (
        <div
            className={`
                ${variants[variant]}
                rounded-lg p-6
                ${hoverClasses}
                ${animateClasses}
                ${className}
            `}
            style={animate ? { animationDelay: `${delay * 1000}ms` } : undefined}
        >
            {children}
        </div>
    )
}

export default Card
