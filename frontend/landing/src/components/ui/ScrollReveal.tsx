import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  className?: string
}

const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  className = ''
}: ScrollRevealProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
    none: { y: 0, x: 0 }
  }

  const initialState = direction === 'none'
    ? { opacity: 0, scale: 0.9 }
    : { opacity: 0, ...directions[direction] }

  const animateState = direction === 'none'
    ? { opacity: 1, scale: 1 }
    : { opacity: 1, y: 0, x: 0 }

  return (
    <motion.div
      ref={ref}
      initial={initialState}
      animate={isInView ? animateState : initialState}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
