import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import HologramCard from './HologramCard'
import { redirectToPortal, type PortalType } from '@/utils/navigation'

interface UserTypeCardProps {
  type: PortalType
  icon: LucideIcon
  title: string
  description: string
}

const UserTypeCard = ({
  type,
  icon: Icon,
  title,
  description
}: UserTypeCardProps) => {
  const handleClick = () => {
    redirectToPortal(type)
  }

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: '0 0 40px rgba(0, 255, 240, 0.6)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <HologramCard className="p-8 h-full flex flex-col items-center text-center group">
        {/* Floating Icon */}
        <motion.div
          className="mb-6"
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className="relative">
            <Icon className="w-20 h-20 text-cyan drop-shadow-[0_0_15px_rgba(0,255,240,0.7)]" />
            <motion.div
              className="absolute inset-0 bg-cyan rounded-full blur-xl opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-cyan mb-3 text-glow-cyan group-hover:text-white transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-metal-silver group-hover:text-white transition-colors">
          {description}
        </p>

        {/* Hover indicator */}
        <motion.div
          className="mt-6 text-cyan-glow text-sm opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          Clique para acessar →
        </motion.div>
      </HologramCard>
    </motion.div>
  )
}

export default UserTypeCard
