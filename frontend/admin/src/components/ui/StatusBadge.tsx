import { motion } from 'framer-motion'

interface StatusBadgeProps {
    status: 'active' | 'pending' | 'completed' | 'cancelled' | 'inactive' | 'confirmed'
    neonColor?: boolean
    pulse?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const statusConfig = {
    active: {
        label: 'Ativo',
        color: 'bg-terminalgreen/10 text-terminalgreen border-terminalgreen/30',
        glowColor: 'shadow-[0_0_10px_rgba(48,209,88,0.3)]',
    },
    pending: {
        label: 'Pendente',
        color: 'bg-alertorange/10 text-alertorange border-alertorange/30',
        glowColor: 'shadow-[0_0_10px_rgba(255,159,10,0.3)]',
    },
    completed: {
        label: 'Concluído',
        color: 'bg-techblue/10 text-techblue border-techblue/30',
        glowColor: 'shadow-[0_0_10px_rgba(10,132,255,0.3)]',
    },
    cancelled: {
        label: 'Cancelado',
        color: 'bg-criticalred/10 text-criticalred border-criticalred/30',
        glowColor: 'shadow-[0_0_10px_rgba(255,69,58,0.3)]',
    },
    inactive: {
        label: 'Inativo',
        color: 'bg-metal-silver/10 text-metal-silver border-metal-silver/30',
        glowColor: '',
    },
    confirmed: {
        label: 'Confirmado',
        color: 'bg-cyan/10 text-cyan border-cyan/30',
        glowColor: 'shadow-[0_0_10px_rgba(0,255,240,0.3)]',
    },
}

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
}

const StatusBadge = ({
    status,
    neonColor = true,
    pulse = false,
    size = 'md',
    className = '',
}: StatusBadgeProps) => {
    const config = statusConfig[status]

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
                inline-flex items-center gap-1.5
                ${sizeClasses[size]}
                ${config.color}
                ${neonColor ? config.glowColor : ''}
                border rounded-full
                font-medium
                transition-all duration-300
                ${className}
            `}
        >
            <span
                className={`
                    w-1.5 h-1.5 rounded-full
                    ${config.color.split(' ')[1].replace('text-', 'bg-')}
                    ${pulse ? 'animate-pulse' : ''}
                `}
            />
            {config.label}
        </motion.span>
    )
}

export default StatusBadge
