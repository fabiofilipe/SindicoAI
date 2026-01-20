import type { ReactNode } from 'react'

interface LandingLayoutProps {
  children: ReactNode
}

const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <div className="relative bg-marble w-full">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none bg-pattern-subtle opacity-50" />

      {/* Content */}
      <main className="relative z-10 w-full">
        {children}
      </main>
    </div>
  )
}

export default LandingLayout
