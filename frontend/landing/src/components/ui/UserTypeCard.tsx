import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
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
        y: -8,
        boxShadow: '0 8px 24px rgba(184, 134, 11, 0.2)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="user-type-card group"
    >
      {/* Icon */}
      <motion.div
        className="mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="icon-container-lg mx-auto user-icon transition-all duration-300">
          <Icon className="w-8 h-8" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Title */}
      <h3 className="text-2xl font-display font-semibold text-ink mb-3 group-hover:text-brass transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-stone mb-6 leading-relaxed">
        {description}
      </p>

      {/* Hover indicator */}
      <div className="flex items-center justify-center gap-2 text-brass opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="text-sm font-medium">Acessar portal</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </motion.div>
  )
}

export default UserTypeCard
