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
      className="feature-card group"
    >
      {/* Icon container */}
      <div className="icon-container mb-4 group-hover:bg-brass/10 group-hover:scale-105 transition-all duration-300">
        <Icon className="w-6 h-6 feature-icon transition-colors duration-300" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-ink mb-2 group-hover:text-brass transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-stone text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

export default FeatureCard
