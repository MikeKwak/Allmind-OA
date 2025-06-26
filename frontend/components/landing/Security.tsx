import { Shield, Lock, Eye, CheckCircle, ArrowUpRight } from 'lucide-react'
import Container from '../ui/Container'

const securityFeatures = [
  {
    icon: Shield,
    title: "No training on your data",
    description: "Your data remains private and secure"
  },
  {
    icon: Lock,
    title: "Modern & secure data practices",
    description: "Industry-leading security protocols"
  },
  {
    icon: Eye,
    title: "End to end encryption",
    description: "All data is encrypted in transit and at rest"
  },
  {
    icon: CheckCircle,
    title: "Audited & tested",
    description: "Regular security audits and penetration testing"
  }
]

const certifications = [
  { name: "SOC2" },
  { name: "CCPA" },
  { name: "ISO 27001" },
  { name: "GDPR" },
]

export default function Security() {
  return (
    <section className="bg-white">
      <Container>
        <div className="bg-[#181818] p-8 flex flex-col lg:flex-row gap-12">
          {/* Left */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Icon + Label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white p-2">
                <Shield className="w-7 h-7 text-[#181818]" />
              </div>
              <span className="text-base font-mono text-white">Security</span>
            </div>
            {/* Headline */}
            <h2 className="text-4xl font-martina mb-6 leading-tight">
              <span className="text-gray-400">Built for Enterprise<br /></span>
              <span className="text-white">Secure by Design</span>
            </h2>
            {/* Feature List */}
            <ul className="mb-8 space-y-4">
              {securityFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-white opacity-80" />
                  <span className="text-gray-200">{feature.title}</span>
                </li>
              ))}
            </ul>
            {/* Find out more */}
            <a
              href="./security"
              className="inline-flex items-center gap-2 text-white hover:underline mt-4"
            >
              <span>Find out more</span>
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
          {/* Right: Certifications */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            {certifications.map((cert, idx) => (
              <div
                key={cert.name}
                className="flex flex-col items-center justify-center bg-[#232323] border border-[#333] py-8"
              >
                <span className="text-gray-400 mb-4">{cert.name}</span>
                {/* Replace below with your SVGs for each cert */}
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center opacity-60">
                  {/* {cert.icon} */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
} 