import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
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
            primary: 'bg-gradient-cyber text-coal font-bold shadow-glow hover:shadow-glow-lg active:scale-95',
            secondary: 'bg-coal-light text-cyan border border-cyan-glow/30 hover:border-cyan active:scale-95',
            outline: 'bg-transparent text-cyan border border-cyan hover:bg-cyan/10 active:scale-95',
            ghost: 'bg-transparent text-metal-silver hover:bg-coal-light hover:text-cyan active:scale-95',
            danger: 'bg-gradient-alert text-white font-bold shadow-[0_0_20px_rgba(255,69,58,0.3)] active:scale-95',
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
