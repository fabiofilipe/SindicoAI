import { motion } from 'framer-motion'

interface GlowOrbProps {
  color?: 'cyan' | 'blue' | 'purple'
  size?: number
  top?: string
  left?: string
  right?: string
  bottom?: string
  delay?: number
}

const GlowOrb = ({
  color = 'cyan',
  size = 300,
  top,
  left,
  right,
  bottom,
  delay = 0
}: GlowOrbProps) => {
  const colors = {
    cyan: '#00FFF0',
    blue: '#0A84FF',
    purple: '#AF52DE'
  }

  const floatingAnimation = {
    y: [0, -30, 0],
    x: [0, 20, 0],
    scale: [1, 1.1, 1],
  }

  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        backgroundColor: colors[color],
      }}
      animate={floatingAnimation}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
    />
  )
}

export default GlowOrb
