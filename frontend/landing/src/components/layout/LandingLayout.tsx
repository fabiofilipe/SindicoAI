import type { ReactNode } from 'react'
import GlowOrb from '@/components/ui/GlowOrb'

interface LandingLayoutProps {
  children: ReactNode
}

const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <div className="relative bg-tech-grid w-full">
      {/* Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <GlowOrb color="cyan" size={400} top="-10%" left="-10%" delay={0} />
        <GlowOrb color="blue" size={350} top="30%" right="-15%" delay={1} />
        <GlowOrb color="purple" size={300} bottom="10%" left="20%" delay={2} />
        <GlowOrb color="cyan" size={250} bottom="-5%" right="15%" delay={3} />
      </div>

      {/* Content */}
      <main className="relative z-10 w-full">
        {children}
      </main>
    </div>
  )
}

export default LandingLayout
