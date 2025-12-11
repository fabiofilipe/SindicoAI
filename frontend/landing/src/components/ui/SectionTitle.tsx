import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

const SectionTitle = ({
  title,
  subtitle,
  align = 'center',
  className = ''
}: SectionTitleProps) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <ScrollReveal direction="up" className={className}>
      <div className={alignmentClasses[align]}>
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gradient-cyber mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="text-lg md:text-xl text-metal-silver/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </ScrollReveal>
  )
}

export default SectionTitle
