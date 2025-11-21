import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    glow?: boolean
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    glow = false,
    className = '',
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'btn-glow',
        secondary: 'bg-coal-light border border-cyan hover:bg-coal-light/80 text-cyan',
        outline: 'bg-transparent border border-cyan text-cyan hover:bg-cyan/10',
        ghost: 'bg-transparent text-cyan hover:bg-cyan/10',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    const glowClass = glow && variant !== 'primary' ? 'shadow-glow' : ''

    return (
        <button
            className={`
        rounded-lg font-semibold transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${glowClass} ${className}
      `}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
