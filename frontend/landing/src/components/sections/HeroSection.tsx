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
    <section className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 min-h-screen">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center"
      >
        {/* Logo */}
        <motion.div
          variants={scaleIn}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-10 inline-block"
        >
          <div className="icon-container-lg !w-24 !h-24 !rounded-2xl mx-auto">
            <Building2 className="w-12 h-12" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="line-brass mx-auto mb-8"
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />

        {/* Title */}
        <motion.h1
          variants={fadeInUp}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="hero-title mb-6"
        >
          {copy.hero.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="hero-subtitle mx-auto mb-12"
        >
          {copy.hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.9, duration: 0.6 }}
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
            variant="secondary"
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
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-20"
        >
          <motion.div
            animate={{
              y: [0, 8, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="inline-block"
          >
            <ChevronDown className="w-6 h-6 text-brass opacity-60" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection
