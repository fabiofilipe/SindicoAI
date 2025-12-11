import LandingLayout from '@/components/layout/LandingLayout'
import HeroSection from '@/components/sections/HeroSection'
import UserTypeSection from '@/components/sections/UserTypeSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import AboutSection from '@/components/sections/AboutSection'
import Footer from '@/components/sections/Footer'

const LandingPage = () => {
  return (
    <LandingLayout>
      <HeroSection />
      <UserTypeSection />
      <FeaturesSection />
      <AboutSection />
      <Footer />
    </LandingLayout>
  )
}

export default LandingPage
