import type { ReactNode } from 'react'
import GlowOrb from '@/components/ui/GlowOrb'

interface LandingLayoutProps {
  children: ReactNode
}

const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <div className="relative min-h-screen bg-tech-grid overflow-x-hidden">
      {/* Ambient Glow Orbs */}
      <GlowOrb color="cyan" size={400} top="-10%" left="-10%" delay={0} />
      <GlowOrb color="blue" size={350} top="30%" right="-15%" delay={1} />
      <GlowOrb color="purple" size={300} bottom="10%" left="20%" delay={2} />
      <GlowOrb color="cyan" size={250} bottom="-5%" right="15%" delay={3} />

      {/* Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  )
}

export default LandingLayout
