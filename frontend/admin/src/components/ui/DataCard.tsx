import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'

interface DataCardProps {
    label: string
    value: string | number
    icon?: LucideIcon
    trend?: 'up' | 'down' | 'stable'
    trendValue?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
    glowOnHover?: boolean
    className?: string
}

const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
}

const valueSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
}

const variantClasses = {
    default: 'border-cyan-glow',
    success: 'border-terminalgreen/30',
    warning: 'border-alertorange/30',
    error: 'border-criticalred/30',
    info: 'border-techblue/30',
}

const variantIconClasses = {
    default: 'text-cyan',
    success: 'text-terminalgreen',
    warning: 'text-alertorange',
    error: 'text-criticalred',
    info: 'text-techblue',
}

const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
}

const trendColors = {
    up: 'text-terminalgreen',
    down: 'text-criticalred',
    stable: 'text-metal-silver',
}

const DataCard = ({
    label,
    value,
    icon: Icon,
    trend,
    trendValue,
    size = 'md',
    variant = 'default',
    glowOnHover = true,
    className = '',
}: DataCardProps) => {
    const TrendIcon = trend ? trendIcons[trend] : null

    return (
        <motion.div
            whileHover={glowOnHover ? { scale: 1.02, y: -2 } : {}}
            className={`
                ${sizeClasses[size]}
                bg-coal-light/85 backdrop-blur-md
                border ${variantClasses[variant]}
                rounded-lg
                transition-all duration-300
                ${glowOnHover ? 'hover:shadow-glow' : ''}
                ${className}
            `}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-metal-silver/80 font-medium mb-1">{label}</p>
                    <p className={`${valueSizeClasses[size]} font-bold ${variantIconClasses[variant]} font-mono`}>
                        {value}
                    </p>
                </div>

                {Icon && (
                    <div className={`p-3 rounded-lg bg-${variant === 'default' ? 'cyan' : variant}/10`}>
                        <Icon className={`w-6 h-6 ${variantIconClasses[variant]}`} />
                    </div>
                )}
            </div>

            {trend && TrendIcon && (
                <div className="flex items-center gap-2">
                    <TrendIcon className={`w-4 h-4 ${trendColors[trend]}`} />
                    <span className={`text-sm ${trendColors[trend]}`}>{trendValue}</span>
                </div>
            )}
        </motion.div>
    )
}

export default DataCard
