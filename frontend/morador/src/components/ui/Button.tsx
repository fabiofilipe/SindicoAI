import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    fullWidth?: boolean
    children?: ReactNode
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
            primary: 'bg-brass text-cream font-medium shadow-soft hover:shadow-brass hover:scale-[1.02] active:scale-[0.98]',
            secondary: 'bg-champagne text-ink border border-border-medium hover:border-border-brass hover:bg-parchment hover:scale-[1.02] active:scale-[0.98]',
            outline: 'bg-transparent text-brass border border-brass hover:bg-brass hover:text-cream hover:scale-[1.02] active:scale-[0.98]',
            ghost: 'bg-transparent text-graphite hover:bg-parchment hover:text-ink hover:scale-[1.02] active:scale-[0.98]',
            danger: 'bg-burgundy text-cream font-medium hover:bg-burgundy/90 hover:scale-[1.02] active:scale-[0.98]',
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
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    flex items-center justify-center gap-2
                    transition-all duration-200
                    ${className}
                `}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                )}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export default Button
