import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import EnterpriseDeployment from '@/components/landing/EnterpriseDeployment'
import Testimonials from '@/components/landing/Testimonials'
import Security from '@/components/landing/Security'
import Footer from '@/components/landing/Footer'
import AICopilot from '@/components/copilot/AICopilot'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <EnterpriseDeployment />
      <Security />
      <Testimonials />
      <Footer />
      <AICopilot />
    </main>
  )
} 