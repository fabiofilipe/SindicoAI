import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<'button'>> {
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
            primary: 'bg-gradient-cyber text-coal font-bold shadow-glow',
            secondary: 'bg-coal-light text-cyan border border-cyan-glow/30',
            outline: 'bg-transparent text-cyan border border-cyan',
            ghost: 'bg-transparent text-metal-silver',
            danger: 'bg-gradient-alert text-white font-bold shadow-[0_0_20px_rgba(255,69,58,0.3)]',
        }

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        }

        return (
            <motion.button
                ref={ref}
                className={`
                    ${variants[variant]}
                    ${sizes[size]}
                    ${fullWidth ? 'w-full' : ''}
                    rounded-lg
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                    ${className}
                `}
                disabled={disabled || isLoading}
                whileHover={
                    !disabled && !isLoading
                        ? {
                              scale: 1.02,
                              boxShadow:
                                  variant === 'primary'
                                      ? '0 0 30px rgba(0, 255, 240, 0.5)'
                                      : variant === 'danger'
                                        ? '0 0 30px rgba(255, 69, 58, 0.5)'
                                        : '0 0 20px rgba(0, 255, 240, 0.3)',
                          }
                        : {}
                }
                whileTap={
                    !disabled && !isLoading
                        ? {
                              scale: 0.98,
                          }
                        : {}
                }
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 17,
                }}
                {...props}
            >
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                )}
                {children}
            </motion.button>
        )
    }
)

Button.displayName = 'Button'

export default Button
