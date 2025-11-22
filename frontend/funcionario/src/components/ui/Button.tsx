import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'md' | 'lg'
    isLoading?: boolean
    fullWidth?: boolean
    children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    disabled,
    children,
    className = '',
    ...props
}) => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const sizeStyles = {
        md: 'px-6 py-3 text-base min-h-[48px]',
        lg: 'px-8 py-4 text-lg min-h-[56px]',
    }

    const variantStyles = {
        primary: 'bg-neon-cyan text-coal hover:shadow-glow-cyan font-bold border-2 border-neon-cyan',
        secondary: 'border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-coal',
        danger: 'bg-critical-red text-white hover:shadow-glow-red border-2 border-critical-red',
    }

    return (
        <button
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {children}
        </button>
    )
}

export default Button
