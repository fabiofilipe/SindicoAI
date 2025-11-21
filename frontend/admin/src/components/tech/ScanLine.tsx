import { motion } from 'framer-motion'

interface ScanLineProps {
    direction?: 'horizontal' | 'vertical'
    duration?: number
    className?: string
}

const ScanLine = ({ direction = 'vertical', duration = 3, className = '' }: ScanLineProps) => {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <motion.div
                className={`
                    absolute bg-gradient-to-${direction === 'vertical' ? 'b' : 'r'}
                    from-transparent via-cyan/30 to-transparent
                    ${direction === 'vertical' ? 'left-0 w-full h-px' : 'top-0 h-full w-px'}
                `}
                animate={
                    direction === 'vertical'
                        ? { y: ['0%', '100%'] }
                        : { x: ['0%', '100%'] }
                }
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
        </div>
    )
}

export default ScanLine
