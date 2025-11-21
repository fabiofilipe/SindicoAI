import { ChevronDown } from 'lucide-react'
import { forwardRef, SelectHTMLAttributes } from 'react'

interface SelectOption {
    label: string
    value: string | number
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
    label?: string
    options?: SelectOption[]
    error?: string
    helperText?: string
    variant?: 'neon' | 'terminal' | 'glass'
    placeholder?: string
}

const variantClasses = {
    neon: 'bg-coal-light border-cyan-glow focus:border-cyan focus:shadow-glow',
    terminal: 'bg-coal border-cyan/50 font-mono focus:border-cyan focus:shadow-glow-sm',
    glass: 'bg-coal-light/50 backdrop-blur-sm border-cyan-glow/50 focus:border-cyan focus:shadow-glow',
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, helperText, variant = 'neon', placeholder, children, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-metal-silver mb-2">
                        {label}
                        {props.required && <span className="text-criticalred ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    <select
                        ref={ref}
                        className={`
                            w-full px-4 py-3 pr-10 rounded-lg
                            border ${variantClasses[variant]}
                            text-metal-silver
                            focus:outline-none
                            transition-all duration-300
                            appearance-none
                            ${error ? 'border-criticalred focus:border-criticalred' : ''}
                            ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options ? options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        )) : children}
                    </select>

                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan pointer-events-none" />
                </div>

                {error && <p className="mt-1 text-sm text-criticalred">{error}</p>}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-metal-silver/60">{helperText}</p>
                )}
            </div>
        )
    }
)

Select.displayName = 'Select'

export default Select
