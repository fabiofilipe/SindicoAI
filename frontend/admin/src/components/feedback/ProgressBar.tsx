import { motion } from 'framer-motion'

interface ProgressBarProps {
    value: number // 0-100
    max?: number
    variant?: 'cyber' | 'industrial' | 'success' | 'warning' | 'error'
    size?: 'sm' | 'md' | 'lg'
    showLabel?: boolean
    animated?: boolean
    className?: string
}

const variantClasses = {
    cyber: 'bg-gradient-cyber',
    industrial: 'bg-gradient-industrial',
    success: 'bg-terminalgreen',
    warning: 'bg-alertorange',
    error: 'bg-criticalred',
}

const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
}

const ProgressBar = ({
    value,
    max = 100,
    variant = 'cyber',
    size = 'md',
    showLabel = false,
    animated = true,
    className = '',
}: ProgressBarProps) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-metal-silver">Progresso</span>
                    <span className="text-sm font-mono text-cyan">{Math.round(percentage)}%</span>
                </div>
            )}

            <div className={`w-full ${sizeClasses[size]} bg-coal-light rounded-full overflow-hidden border border-cyan-glow/30`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                        duration: animated ? 0.5 : 0,
                        ease: 'easeOut',
                    }}
                    className={`h-full ${variantClasses[variant]} rounded-full relative`}
                >
                    {animated && percentage > 0 && (
                        <motion.div
                            className="absolute inset-0 bg-white/30"
                            animate={{
                                x: ['-100%', '100%'],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default ProgressBar
