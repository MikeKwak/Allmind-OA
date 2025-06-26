import Link from 'next/link'
import Container from '../ui/Container'

export default function Footer() {
  return (
    <footer className="bg-white text-black py-16 border-t border-gray-200">
      <Container>
        {/* Title and Request Demo Button */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-martina text-black leading-tight">
              Unlock Financial AI
            </h2>
            <div className="text-4xl md:text-5xl font-martina text-gray-500 leading-tight">
              For Your Firm
            </div>
          </div>
          <Link
            href="#"
            className="w-full lg:w-auto mt-6 lg:mt-0 inline-block bg-black text-white rounded-full px-8 py-3 text-base font-br-sonoma-regular transition-colors hover:bg-gray-800 text-center"
          >
            Request Demo
          </Link>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-200 mb-12" />
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* OVERVIEW */}
          <div>
            <h4 className="uppercase text-xs font-br-sonoma-medium text-gray-500 mb-4 tracking-widest">Overview</h4>
            <ul className="space-y-2 text-base font-br-sonoma-regular">
              <li><Link href="#" className="hover:text-gray-700 transition-colors">Product</Link></li>
              <li><Link href="#" className="hover:text-gray-700 transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-gray-700 transition-colors">Security</Link></li>
            </ul>
          </div>
          {/* COMPANY */}
          <div>
            <h4 className="uppercase text-xs font-br-sonoma-medium text-gray-500 mb-4 tracking-widest">Company</h4>
            <ul className="space-y-2 text-base font-br-sonoma-regular">
              <li><Link href="#" className="hover:text-gray-700 transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-gray-700 transition-colors">Careers</Link></li>
            </ul>
          </div>
          {/* LEGAL */}
          <div>
            <h4 className="uppercase text-xs font-br-sonoma-medium text-gray-500 mb-4 tracking-widest">Legal</h4>
            <ul className="space-y-2 text-base font-br-sonoma-regular">
              <li><Link href="#" className="hover:text-gray-700 transition-colors">Terms of Use</Link></li>
              <li><Link href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          {/* CONTACT */}
          <div>
            <h4 className="uppercase text-xs font-br-sonoma-medium text-gray-500 mb-4 tracking-widest">Contact</h4>
            <ul className="space-y-2 text-base font-br-sonoma-regular">
              <li><Link href="#" className="hover:text-gray-700 transition-colors">Request Demo</Link></li>
              <li><Link href="#" className="hover:text-gray-700 transition-colors">Email</Link></li>
              <li><Link href="#" className="hover:text-gray-700 transition-colors">LinkedIn</Link></li>
              <li><Link href="#" className="hover:text-gray-700 transition-colors">X / Twitter</Link></li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  )
} 