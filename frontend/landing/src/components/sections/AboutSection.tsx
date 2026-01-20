import { motion } from 'framer-motion'
import { Zap, Star, Lock } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { copy } from '@/content/copy'

const AboutSection = () => {
  const benefits = [
    { icon: Zap, ...copy.about.benefits[0] },
    { icon: Star, ...copy.about.benefits[1] },
    { icon: Lock, ...copy.about.benefits[2] }
  ]

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Visual/Image Column */}
          <ScrollReveal direction="left">
            <div className="relative">
              <motion.div
                className="relative rounded-2xl overflow-hidden border border-border-light shadow-soft-lg group"
                whileHover={{
                  boxShadow: '0 20px 40px rgba(28, 25, 23, 0.15)',
                  y: -4
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative aspect-square">
                  <img
                    src="/assets/pexels-photo-323705.jpeg"
                    alt="Gestão de Condomínios"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-walnut via-walnut/30 to-transparent opacity-70" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-4xl md:text-5xl font-display font-bold text-cream">
                      SindicoAI
                    </p>
                    <p className="text-cream/80 text-sm mt-2">Gestão condominial de excelência</p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-brass rounded-2xl -z-10" />
            </div>
          </ScrollReveal>

          {/* Text Column */}
          <ScrollReveal direction="right">
            <div>
              <div className="line-brass mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-ink mb-6">
                {copy.about.title}
              </h2>
              <p className="text-lg text-graphite leading-relaxed">
                {copy.about.description}
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Benefits Grid */}
        <SectionTitle title="Por que escolher SindicoAI?" className="mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <ScrollReveal key={benefit.title} direction="up" delay={index * 0.15}>
                <motion.div
                  className="card-signature text-center"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="icon-container-lg mx-auto mb-6">
                    <Icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-ink mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-stone leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
