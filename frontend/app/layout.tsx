import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/landing/Navbar'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { brSonomaRegular, brSonomaMedium, martinaPlantijn } from './fonts'

export const metadata: Metadata = {
  title: 'AI Copilot - Intelligent AI Assistant',
  description: 'Experience the future of AI assistance with our intelligent copilot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${brSonomaRegular.variable} font-br-sonoma-regular`}>
        <ErrorBoundary>
          <Navbar />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
} 