import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    }

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Loader2 className={`${sizes[size]} animate-spin text-brass`} />
        </div>
    )
}

export default LoadingSpinner
