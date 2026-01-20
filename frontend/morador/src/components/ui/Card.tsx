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
    variant = 'default'
}: CardProps) => {
    const variants = {
        default: 'bg-cream border border-border-light shadow-soft',
        signature: 'bg-cream border border-border-brass shadow-soft-md',
    }

    const hoverStyles = hover
        ? variant === 'signature'
            ? 'hover:border-brass-light hover:shadow-brass hover:-translate-y-0.5'
            : 'hover:border-stone hover:shadow-soft-md hover:-translate-y-0.5'
        : ''

    return (
        <div
            className={`
                ${variants[variant]}
                ${hoverStyles}
                rounded-lg p-6
                transition-all duration-300
                ${className}
            `}
        >
            {children}
        </div>
    )
}

export default Card
