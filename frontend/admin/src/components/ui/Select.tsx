import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    helperText?: string
    options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            error,
            helperText,
            options,
            className = '',
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-metal-silver mb-2">
                        {label}
                        {props.required && <span className="text-criticalred ml-1">*</span>}
                    </label>
                )}

                <select
                    ref={ref}
                    className={`
                        bg-coal-light border-cyan-glow/50 text-metal-silver
                        ${error ? 'border-criticalred focus:border-criticalred' : 'focus:border-cyan focus:shadow-glow'}
                        w-full px-4 py-3 rounded-lg border
                        focus:outline-none
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${className}
                    `}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

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

Select.displayName = 'Select'

export default Select
