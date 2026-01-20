import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            fullWidth = false,
            className = '',
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const variants = {
            primary: 'bg-brass text-cream font-medium hover:bg-brass-light hover:shadow-brass-lg active:scale-[0.98]',
            secondary: 'bg-transparent border-2 border-brass text-brass font-medium hover:bg-brass hover:text-cream active:scale-[0.98]',
            outline: 'bg-transparent text-graphite border border-border-medium hover:border-brass hover:text-brass active:scale-[0.98]',
            ghost: 'bg-transparent text-graphite hover:bg-champagne hover:text-ink active:scale-[0.98]',
        }

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        }

        return (
            <button
                ref={ref}
                className={`
                    ${variants[variant]}
                    ${sizes[size]}
                    ${fullWidth ? 'w-full' : ''}
                    rounded-lg
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                    ${className}
                `}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export default Button
