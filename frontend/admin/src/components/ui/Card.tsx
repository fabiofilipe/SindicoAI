import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
    children: ReactNode
    className?: string
    hover?: boolean
    animate?: boolean
    delay?: number
}

const Card = ({ children, className = '', hover = false, animate = true, delay = 0 }: CardProps) => {
    return (
        <motion.div
            className={`
                bg-coal-light/80 backdrop-blur-md border border-cyan-glow/30 rounded-xl p-6
                ${className}
            `}
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={animate ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.5,
                delay: delay,
                ease: 'easeOut',
            }}
            whileHover={
                hover
                    ? {
                          borderColor: 'rgba(0, 255, 240, 0.5)',
                          boxShadow: '0 0 20px rgba(0, 255, 240, 0.2)',
                          y: -4,
                      }
                    : {}
            }
        >
            {children}
        </motion.div>
    )
}

export default Card
