interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
    }

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`${sizes[size]} relative animate-in fade-in duration-300`}>
                <div className="absolute inset-0 border-4 border-brass/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-brass rounded-full animate-spin" />
                <div className="absolute inset-2 border-4 border-transparent border-t-brass-light rounded-full animate-spin-slow" />
                <div className="absolute inset-0 bg-brass rounded-full animate-pulse opacity-20" />
            </div>
        </div>
    )
}

export default LoadingSpinner
