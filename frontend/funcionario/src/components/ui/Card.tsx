import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
    onClick?: () => void
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
    const baseStyles = 'bg-charcoal border-2 border-metal-silver/20 rounded-lg p-6 transition-all duration-200'
    const hoverStyles = hover ? 'hover:border-neon-cyan hover:shadow-glow-cyan cursor-pointer' : ''
    const clickableStyles = onClick ? 'cursor-pointer' : ''

    return (
        <div
            className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

export default Card
