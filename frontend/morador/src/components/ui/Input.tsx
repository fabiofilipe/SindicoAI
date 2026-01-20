import { forwardRef, type ReactNode } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    icon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            icon,
            className = '',
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-graphite mb-2">
                        {label}
                        {props.required && <span className="text-burgundy ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
                            bg-marble border text-ink
                            ${error ? 'border-burgundy focus:border-burgundy focus:ring-burgundy/20' : 'border-border-medium focus:border-brass focus:ring-brass/20'}
                            w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-lg border
                            focus:outline-none focus:ring-1
                            transition-all duration-200
                            placeholder:text-silver
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-parchment
                            ${className}
                        `}
                        {...props}
                    />
                </div>

                {error && (
                    <p className="mt-2 text-sm text-burgundy flex items-center gap-1.5">
                        <span className="inline-block w-1 h-1 rounded-full bg-burgundy" />
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="mt-2 text-sm text-stone">{helperText}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
