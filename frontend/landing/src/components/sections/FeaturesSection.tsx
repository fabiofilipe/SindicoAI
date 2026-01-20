import {
  Bot,
  CalendarCheck,
  Bell,
  MessageCircle,
  FileText,
  Shield,
  BarChart3,
  LayoutDashboard
} from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import FeatureCard from '@/components/ui/FeatureCard'
import { copy } from '@/content/copy'

const FeaturesSection = () => {
  const features = [
    { icon: Bot, ...copy.features.items[0] },
    { icon: CalendarCheck, ...copy.features.items[1] },
    { icon: Bell, ...copy.features.items[2] },
    { icon: MessageCircle, ...copy.features.items[3] },
    { icon: FileText, ...copy.features.items[4] },
    { icon: Shield, ...copy.features.items[5] },
    { icon: BarChart3, ...copy.features.items[6] },
    { icon: LayoutDashboard, ...copy.features.items[7] }
  ]

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-champagne/50">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title={copy.features.title}
          subtitle={copy.features.subtitle}
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
