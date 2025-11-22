import type { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    hover?: boolean
}

const Card = ({ children, className = '', hover = false }: CardProps) => {
    return (
        <div
            className={`
                bg-coal-light/80 backdrop-blur-md border border-cyan-glow/30 rounded-xl p-6
                ${hover ? 'hover:border-cyan/50 hover:shadow-glow-sm transition-all duration-300' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    )
}

export default Card
