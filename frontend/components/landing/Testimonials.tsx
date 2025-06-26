'use client' 
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import Container from '../ui/Container'

const testimonials = [
  {
    quote: "Our strategic integration of AllMind is going to transform how we deliver value to clients. AllMind enables our teams to analyze market data and identify opportunities with unprecedented speed and precision, while allowing our bankers to focus more deeply on client relationships and strategic advisory.",
    author: "Patrice Maffre",
    title: "International Head of Investment Banking, Nomura",
    image: '/images/feature-1-bg.jpg'
  },
  {
    quote: "The AllMind platform is by far the most advanced AI tool in this space. It is improving the way we do research and making our team far more productive.",
    author: "Pieter Taselaar",
    title: "Founding partner & Portfolio manager at Lucerne Capital",
    image: '/images/feature-4-bg.jpg'
  },
  {
    quote: "AllMind helped me find relevant precedent data from a number of filings that I wouldn't have found otherwise. It completely changed how I evaluated the opportunity.",
    author: "Sean Warneke",
    title: "Senior Analyst at Schonfeld",
    image: '/images/feature-2-bg.jpg'
  }
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const numTestimonials = testimonials.length

  // Measure card width for responsive carousel
  useLayoutEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setCardWidth(containerRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Carousel navigation functions
  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + numTestimonials) % numTestimonials)
  }, [numTestimonials])

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % numTestimonials)
  }, [numTestimonials])

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (isDragging) return // Don't auto-advance while dragging
    
    timeoutRef.current = setTimeout(() => {
      handleNext()
    }, 5000)
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [current, isDragging, handleNext])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragOffset(0)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const deltaX = e.clientX - dragStartX
    setDragOffset(deltaX)
  }, [isDragging, dragStartX])

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // Determine if we should change slides based on drag distance
    const threshold = cardWidth * 0.2 // 20% of card width
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        handlePrev()
      } else {
        handleNext()
      }
    }
    
    setDragOffset(0)
  }, [isDragging, dragOffset, cardWidth, handlePrev, handleNext])

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    setIsDragging(true)
    setDragStartX(e.touches[0].clientX)
    setDragOffset(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    const deltaX = e.touches[0].clientX - dragStartX
    setDragOffset(deltaX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // Determine if we should change slides based on drag distance
    const threshold = cardWidth * 0.2 // 20% of card width
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        handlePrev()
      } else {
        handleNext()
      }
    }
    
    setDragOffset(0)
  }

  // Global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none' // Prevent text selection while dragging
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <section className="py-20 bg-white">
      <Container>
        {/* Title and Arrows Row */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-martina text-gray-900 mb-0 leading-tight">
              What Customers Say
            </h2>
            <div className="text-3xl font-martina text-gray-400 -mt-2">
              About AllMind
            </div>
          </div>
          <div className="flex gap-2">
            <button
              aria-label="Previous"
              onClick={handlePrev}
              className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              aria-label="Next"
              onClick={handleNext}
              className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Carousel - full width, single card visible */}
        <div className="w-full">
          <div
            className="relative"
            style={{
              width: "100%",
              height: 480,
              overflow: "hidden",
              touchAction: "pan-y",
            }}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex h-full"
              style={{
                width: cardWidth * numTestimonials,
                transform: `translateX(calc(-${current * cardWidth}px + ${dragOffset}px))`,
                transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                willChange: "transform",
                cursor: isDragging ? "grabbing" : "grab",
              }}
            >
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 flex flex-col lg:flex-row bg-gray-50 shadow-md rounded-lg overflow-hidden"
                  style={{
                    width: cardWidth,
                    height: 480,
                  }}
                >
                  {/* Testimonial Text */}
                  <div className="flex-1 flex flex-col justify-center p-8 lg:p-10">
                    <div className="flex flex-col justify-center h-full">
                      <p className="text-xl lg:text-2xl text-gray-900 leading-relaxed mb-8 lg:mb-10">
                        "{testimonial.quote}"
                      </p>
                      <div>
                        <p className="font-br-sonoma-medium text-gray-900">{testimonial.author}</p>
                        <p className="text-xs font-br-sonoma-regular text-gray-500 uppercase tracking-widest">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Image (only on large screens) */}
                  <div className="hidden lg:block w-80 relative overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt="Testimonial"
                      fill
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}