import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: 'neon' | 'terminal' | 'glass'
    glowOnFocus?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ variant = 'neon', glowOnFocus = true, className = '', ...props }, ref) => {
        const variants = {
            neon: 'input-neon',
            terminal: 'bg-coal border border-terminalgreen/50 text-terminalgreen font-mono',
            glass: 'bg-coal-light/50 backdrop-blur-md border border-cyan-glow',
        }

        const focusClass = glowOnFocus ? 'focus:shadow-glow' : ''

        return (
            <input
                ref={ref}
                className={`${variants[variant]} ${focusClass} ${className}`}
                {...props}
            />
        )
    }
)

Input.displayName = 'Input'

export default Input
