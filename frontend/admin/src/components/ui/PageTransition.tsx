import type { ReactNode } from 'react'

interface PageTransitionProps {
    children: ReactNode
    className?: string
}

const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
    return (
        <div className={`animate-in fade-in slide-in-from-bottom-4 duration-400 ${className}`}>
            {children}
        </div>
    )
}

export default PageTransition
