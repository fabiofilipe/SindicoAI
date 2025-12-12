import { motion } from 'framer-motion'
import { Zap, Star, Lock } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedCard from '@/components/ui/AnimatedCard'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { copy } from '@/content/copy'

const AboutSection = () => {
  const benefits = [
    { icon: Zap, ...copy.about.benefits[0] },
    { icon: Star, ...copy.about.benefits[1] },
    { icon: Lock, ...copy.about.benefits[2] }
  ]

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Visual/Image Column */}
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-cyber opacity-20 blur-3xl absolute inset-0" />
              <motion.div
                className="relative rounded-2xl overflow-hidden border border-cyan-glow/30 group"
                whileHover={{
                  boxShadow: '0 0 40px rgba(0, 255, 240, 0.4)',
                  scale: 1.02
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative aspect-square">
                  <img
                    src="/assets/pexels-photo-323705.jpeg"
                    alt="Gestão de Condomínios"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/50 to-transparent opacity-60" />
                  <div className="absolute inset-0 bg-cyan/5 group-hover:bg-cyan/10 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-3xl md:text-4xl font-bold text-gradient-cyber drop-shadow-lg">
                      SindicoAI
                    </p>
                    <p className="text-cyan-glow text-sm mt-2">Tecnologia que transforma</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Text Column */}
          <ScrollReveal direction="right">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gradient-cyber mb-6">
                {copy.about.title}
              </h2>
              <p className="text-lg text-metal-silver leading-relaxed">
                {copy.about.description}
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Benefits Grid */}
        <SectionTitle title="Por que escolher SindicoAI?" className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <AnimatedCard key={benefit.title} delay={index * 0.15} className="p-8 text-center">
                <div className="mb-6 inline-block">
                  <div className="relative">
                    <Icon className="w-16 h-16 text-cyan drop-shadow-[0_0_15px_rgba(0,255,240,0.7)]" />
                    <motion.div
                      className="absolute inset-0 bg-cyan rounded-full blur-xl opacity-50"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.3
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-cyan mb-3 text-glow-cyan">
                  {benefit.title}
                </h3>
                <p className="text-metal-silver">
                  {benefit.description}
                </p>
              </AnimatedCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
