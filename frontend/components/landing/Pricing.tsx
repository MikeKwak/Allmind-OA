import Container from '../ui/Container'

export default function Pricing() {
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-br-sonoma-medium text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl font-br-sonoma-regular text-gray-600">
            Start free, scale as you grow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="bg-white rounded-lg shadow-md p-8 border">
            <h3 className="text-2xl font-br-sonoma-medium text-gray-900 mb-4">Free</h3>
            <p className="text-4xl font-br-sonoma-medium text-blue-600 mb-6">$0<span className="text-lg text-gray-500">/month</span></p>
            <ul className="space-y-3 mb-8 font-br-sonoma-regular">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Unlimited AI conversations
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Basic chat history
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Standard response time
              </li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-br-sonoma-medium">
              Get Started Free
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-600 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-br-sonoma-medium">Most Popular</span>
            </div>
            <h3 className="text-2xl font-br-sonoma-medium text-gray-900 mb-4">Pro</h3>
            <p className="text-4xl font-br-sonoma-medium text-blue-600 mb-6">$9<span className="text-lg text-gray-500">/month</span></p>
            <ul className="space-y-3 mb-8 font-br-sonoma-regular">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Everything in Free
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Advanced AI models
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Priority support
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Export chat history
              </li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-br-sonoma-medium">
              Start Pro Trial
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white rounded-lg shadow-md p-8 border">
            <h3 className="text-2xl font-br-sonoma-medium text-gray-900 mb-4">Enterprise</h3>
            <p className="text-4xl font-br-sonoma-medium text-blue-600 mb-6">$29<span className="text-lg text-gray-500">/month</span></p>
            <ul className="space-y-3 mb-8 font-br-sonoma-regular">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Everything in Pro
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Custom integrations
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Dedicated support
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Advanced analytics
              </li>
            </ul>
            <button className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-br-sonoma-medium">
              Contact Sales
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
} 