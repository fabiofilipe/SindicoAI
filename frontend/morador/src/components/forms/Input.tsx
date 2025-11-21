import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    variant?: 'neon' | 'terminal' | 'glass'
    glowOnFocus?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            variant = 'neon',
            glowOnFocus = true,
            className = '',
            ...props
        },
        ref
    ) => {
        const variants = {
            neon: 'bg-coal-light border-cyan-glow/50 text-metal-silver',
            terminal: 'bg-coal border-terminalgreen/50 text-terminalgreen font-mono',
            glass: 'bg-coal-light/50 backdrop-blur-md border-cyan-glow/30',
        }

        const focusClass = glowOnFocus ? 'focus:border-cyan focus:shadow-glow' : 'focus:border-cyan'

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
                    className={`
                        ${variants[variant]}
                        ${focusClass}
                        ${error ? 'border-criticalred focus:border-criticalred' : ''}
                        w-full px-4 py-3 rounded-lg border
                        focus:outline-none
                        transition-all duration-300
                        placeholder:text-metal-silver/40
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${className}
                    `}
                    {...props}
                />

                {error && (
                    <p className="mt-1 text-sm text-criticalred flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-criticalred animate-pulse" />
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="mt-1 text-sm text-metal-silver/60">{helperText}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
