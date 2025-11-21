import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: 'neon' | 'terminal' | 'glass'
    glowOnFocus?: boolean
    label?: string
    error?: string
    helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ variant = 'neon', glowOnFocus = true, label, error, helperText, className = '', ...props }, ref) => {
        const variants = {
            neon: 'input-neon',
            terminal: 'bg-coal border border-terminalgreen/50 text-terminalgreen font-mono',
            glass: 'bg-coal-light/50 backdrop-blur-md border border-cyan-glow',
        }

        const focusClass = glowOnFocus ? 'focus:shadow-glow' : ''

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-metal-silver mb-2">
                        {label}
                        {props.required && <span className="text-criticalred ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`${variants[variant]} ${focusClass} ${error ? 'border-criticalred focus:border-criticalred' : ''} ${className}`}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-criticalred">{error}</p>}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-metal-silver/60">{helperText}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
