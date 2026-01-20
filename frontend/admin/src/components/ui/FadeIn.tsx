import type { ReactNode } from 'react'

interface FadeInProps {
    children: ReactNode
    delay?: number
    duration?: number
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    className?: string
}

const FadeIn = ({
    children,
    delay = 0,
    duration = 0.5,
    direction = 'up',
    className = '',
}: FadeInProps) => {
    const directionClasses = {
        up: 'slide-in-from-bottom-10',
        down: 'slide-in-from-top-10',
        left: 'slide-in-from-right-10',
        right: 'slide-in-from-left-10',
        none: '',
    }

    return (
        <div
            className={`animate-in fade-in ${directionClasses[direction]} ${className}`}
            style={{
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
            }}
        >
            {children}
        </div>
    )
}

export default FadeIn
