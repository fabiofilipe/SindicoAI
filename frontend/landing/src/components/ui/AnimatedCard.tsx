import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import HologramCard from './HologramCard'

interface AnimatedCardProps {
  children: ReactNode
  delay?: number
  className?: string
}

const AnimatedCard = ({
  children,
  delay = 0,
  className = ''
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut'
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <HologramCard className={className}>
        {children}
      </HologramCard>
    </motion.div>
  )
}

export default AnimatedCard
