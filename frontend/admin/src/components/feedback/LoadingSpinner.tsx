interface LoadingSpinnerProps {
    variant?: 'orbital' | 'pulse' | 'scan' | 'dataStream'
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const LoadingSpinner = ({
    variant = 'orbital',
    size = 'md',
    className = ''
}: LoadingSpinnerProps) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    }

    if (variant === 'orbital') {
        return (
            <div className={`${sizes[size]} ${className}`}>
                <div className="animate-spin rounded-full border-2 border-cyan/20 border-t-cyan h-full w-full" />
            </div>
        )
    }

    if (variant === 'pulse') {
        return (
            <div className={`${sizes[size]} ${className}`}>
                <div className="animate-pulse-glow rounded-full bg-cyan h-full w-full" />
            </div>
        )
    }

    if (variant === 'dataStream') {
        return (
            <div className={`flex space-x-1 ${className}`}>
                <div className="w-2 h-8 bg-cyan animate-data-stream" />
                <div className="w-2 h-8 bg-cyan animate-data-stream" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-8 bg-cyan animate-data-stream" style={{ animationDelay: '0.4s' }} />
            </div>
        )
    }

    // scan variant
    return (
        <div className={`${sizes[size]} ${className} scan-line-container`}>
            <div className="scan-line" />
        </div>
    )
}

export default LoadingSpinner
