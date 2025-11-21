import { forwardRef, TextareaHTMLAttributes } from 'react'

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
    label?: string
    error?: string
    helperText?: string
    variant?: 'neon' | 'terminal' | 'glass'
}

const variantClasses = {
    neon: 'bg-coal-light border-cyan-glow focus:border-cyan focus:shadow-glow',
    terminal: 'bg-coal border-cyan/50 font-mono focus:border-cyan focus:shadow-glow-sm',
    glass: 'bg-coal-light/50 backdrop-blur-sm border-cyan-glow/50 focus:border-cyan focus:shadow-glow',
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, variant = 'neon', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-metal-silver mb-2">
                        {label}
                        {props.required && <span className="text-criticalred ml-1">*</span>}
                    </label>
                )}

                <textarea
                    ref={ref}
                    className={`
                        w-full px-4 py-3 rounded-lg
                        border ${variantClasses[variant]}
                        text-metal-silver placeholder:text-metal-silver/50
                        focus:outline-none
                        transition-all duration-300
                        resize-none
                        ${error ? 'border-criticalred focus:border-criticalred' : ''}
                        ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    rows={props.rows || 4}
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

Textarea.displayName = 'Textarea'

export default Textarea
