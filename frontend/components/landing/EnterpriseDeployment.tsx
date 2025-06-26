import { Building2, Shield, Users } from 'lucide-react';
import Container from '../ui/Container'

const enterpriseFeatures = [
  {
    icon: Building2,
    title: "Custom-Trained Models",
    description: "LLMs built for finance, using professionally labeled data tailored to the standards of your firm's best analysts.",
  },
  {
    icon: Shield,
    title: "Single Tenant Deployments",
    description: "Flexible deployment options to meet the security & infrastructure needs for the most conscious firms.",
  },
  {
    icon: Users,
    title: "Admin Governance & Permissions",
    description: "Granular permission controls, role-based access management, comprehensive audit trails, & customizable governance policies.",
  },
];

export default function EnterpriseDeployment() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-8">
          <h2 className="font-martina font-normal text-[40px] md:text-[48px] leading-[1.1] text-[#151515] mb-4">
            Built for Enterprise Deployment
          </h2>
          <p className="text-gray-500 text-lg font-br-sonoma-regular">
            Rogo keeps your data safe with world-class security and data privacy measures.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {enterpriseFeatures.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-gray-100 p-8 flex flex-col h-full ${
                index === 2 ? 'md:col-span-2' : ''
              }`}
            >
              <div className="w-12 h-12 bg-black flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-br-sonoma-medium text-lg md:text-xl text-[#151515] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 font-br-sonoma-regular text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
} 