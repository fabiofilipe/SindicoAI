import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    fullWidth?: boolean
    children?: React.ReactNode
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
    const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm min-h-[36px]',
        md: 'px-6 py-3 text-base min-h-[48px]',
        lg: 'px-8 py-4 text-lg min-h-[56px]',
    }

    const variantStyles = {
        primary: 'bg-brass text-cream hover:shadow-brass hover:bg-brass-light',
        secondary: 'bg-champagne text-ink border border-border-medium hover:border-border-brass hover:bg-parchment',
        outline: 'bg-transparent text-brass border border-brass hover:bg-brass hover:text-cream',
        ghost: 'bg-transparent text-graphite hover:bg-parchment hover:text-ink',
        danger: 'bg-burgundy text-cream hover:bg-burgundy/90',
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
