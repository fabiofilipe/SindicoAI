import React, { type InputHTMLAttributes, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, type = 'text', className = '', ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)
        const isPassword = type === 'password'
        const inputType = isPassword && showPassword ? 'text' : type

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-metal-silver font-medium mb-2 text-lg">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-metal-silver">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={inputType}
                        className={`
                            w-full px-4 py-3 min-h-[48px] text-base
                            bg-charcoal border-2 border-metal-silver/30
                            text-white placeholder-metal-silver/50
                            rounded-lg transition-all duration-200
                            focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan
                            ${icon ? 'pl-12' : ''}
                            ${error ? 'border-critical-red focus:border-critical-red' : ''}
                            ${className}
                        `}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-metal-silver hover:text-neon-cyan transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    )}
                </div>
                {error && (
                    <p className="mt-2 text-critical-red text-sm">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
