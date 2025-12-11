import { motion } from 'framer-motion'
import { Building2, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import { copy } from '@/content/copy'
import { staggerContainer, scaleIn, fadeInUp } from '@/utils/animations'

const HeroSection = () => {
  const scrollToUserTypes = () => {
    const userTypesSection = document.getElementById('user-types')
    userTypesSection?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features')
    featuresSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto text-center"
      >
        {/* Logo */}
        <motion.div
          variants={scaleIn}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <Building2 className="w-24 h-24 text-cyan drop-shadow-[0_0_30px_rgba(0,255,240,0.8)] mx-auto" />
            <motion.div
              className="absolute inset-0 bg-cyan rounded-full blur-2xl opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeInUp}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6"
        >
          <span className="hero-title">{copy.hero.title}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl text-metal-silver mb-12 max-w-3xl mx-auto"
        >
          {copy.hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={scrollToFeatures}
            className="min-w-[200px]"
          >
            {copy.hero.cta.primary}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToUserTypes}
            className="min-w-[200px]"
          >
            {copy.hero.cta.secondary}
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-20"
        >
          <motion.div
            animate={{
              y: [0, 10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="inline-block"
          >
            <ChevronDown className="w-8 h-8 text-cyan opacity-70" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection
