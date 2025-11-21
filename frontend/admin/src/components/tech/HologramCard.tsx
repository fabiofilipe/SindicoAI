import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface HologramCardProps {
    children: ReactNode
    className?: string
}

const HologramCard = ({ children, className = '' }: HologramCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ y: -5 }}
            className={`
                relative overflow-hidden
                bg-coal-light/50 backdrop-blur-md
                border border-cyan-glow
                rounded-lg
                shadow-glow
                ${className}
            `}
        >
            {/* Holographic gradient overlay */}
            <div className="absolute inset-0 holographic opacity-20 pointer-events-none" />

            {/* Scan line effect */}
            <div className="absolute inset-0 scan-line-container pointer-events-none">
                <motion.div
                    className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan to-transparent"
                    animate={{ y: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.div>
    )
}

export default HologramCard
