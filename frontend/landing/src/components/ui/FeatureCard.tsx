import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { fadeInUp } from '@/utils/animations'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  index: number
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  index
}: FeatureCardProps) => {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1
      }}
      whileHover={{
        y: -10,
        boxShadow: '0 0 30px rgba(0, 255, 240, 0.4)'
      }}
      className="bg-coal-light/80 backdrop-blur-md border border-cyan-glow/30 rounded-xl p-6 transition-all duration-300 hover:border-cyan/50"
    >
      {/* Icon with rotating glow */}
      <div className="relative mb-4 w-fit">
        <motion.div
          className="absolute inset-0 bg-gradient-cyber rounded-lg blur-md opacity-50"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <div className="relative bg-coal-light/90 p-3 rounded-lg border border-cyan-glow/50">
          <Icon className="w-8 h-8 text-cyan" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-cyan mb-2 text-glow-cyan">
        {title}
      </h3>

      {/* Description */}
      <p className="text-metal-silver text-sm">
        {description}
      </p>
    </motion.div>
  )
}

export default FeatureCard
