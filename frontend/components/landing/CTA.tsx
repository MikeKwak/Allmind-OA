import Container from '../ui/Container'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <Container className="text-center">
        <h2 className="text-4xl font-br-sonoma-medium text-white mb-6">
          Ready to Experience AI Copilot?
        </h2>
        <p className="text-xl font-br-sonoma-regular text-white/90 mb-8">
          Join thousands of users who are already enjoying intelligent conversations with AI
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-br-sonoma-medium text-lg hover:bg-gray-100 transition-all duration-300">
            Get Started Now
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-full font-br-sonoma-medium text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
            View Chat History
          </button>
        </div>
        
        <div className="mt-8 text-white/70">
          <p className="text-sm font-br-sonoma-regular">No registration required • Free to use • Powered by Google AI</p>
        </div>
      </Container>
    </section>
  )
} 