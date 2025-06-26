import { Brain, FileText, Shield, Users, BarChart3, Search } from 'lucide-react'
import Container from '../ui/Container'

const features = [
  {
    title: "Tailored for Finance",
    description: "Delegate research tasks to a domain-specific personal analyst that understands finance.",
    bg: "/images/feature-1-bg.jpg",
    overlay: "/images/feature-1-vid.png"
  },
  {
    title: "Accurate, Grounded Research Across All Your Data",
    description: "Rogo seamlessly integrates internal and external data sources, maintaining accuracy, transparency and auditability.",
    bg: "/images/feature-2-bg.jpg",
    overlay: "/images/feature-2-vid.png"
  },
  {
    title: "Leverage Your Firm's Workflows",
    description: "Use agents designed to create work outputs exactly as you would across PowerPoint, Excel and Word.",
    bg: "/images/feature-3-bg.jpg",
    overlay: "/images/feature-1-vid.png" // Replace with feature-3-vid.png if available
  },
  {
    title: "Embed AI into Your Firm's DNA",
    description: "Rather than provide off-the-shelf solutions, we collaborate closely with teams to build custom AI models that solve specific problems.",
    bg: "/images/feature-4-bg.jpg",
    overlay: "/images/feature-4-vid.png"
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-white" id="features">
      <Container>
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="font-martina font-normal text-[48px] leading-[53px] text-[#151515] mb-0">
            Augment Your Firm with an
          </h2>
          <h2 className="font-martina font-normal text-[48px] leading-[53px] text-[#737373]">
            AI Platform Built for Finance
          </h2>
        </div>
        <div className="flex flex-col gap-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-start gap-8"
            >
              {/* Text Section - Now above image */}
              <div className="flex flex-col justify-center items-start text-left max-w-2xl">
                <h3 className="font-martina font-normal text-[32px] lg:text-[40px] leading-[44px] text-[#151515] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
              {/* Image Section - Now below text */}
              <div className="w-full flex justify-center items-center relative aspect-[16/9] min-h-[240px]">
                <img
                  src={feature.bg}
                  alt=""
                  className="w-full h-full object-cover absolute top-0 left-0"
                  style={{ zIndex: 1 }}
                />
                <img
                  src={feature.overlay}
                  alt=""
                  className="absolute top-1/2 left-1/2 w-2/3 max-w-[80%] -translate-x-1/2 -translate-y-1/2"
                  style={{ zIndex: 2, pointerEvents: 'none' }}
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
} 