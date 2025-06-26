"use client";
import { ArrowRight, Shield, Building2, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from "react";

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <section
        className="relative flex flex-col justify-between overflow-hidden pb-8"
        style={{ 
          height: "calc(100vh - 104px)",        // 104px is the height of the navbar`
          maxHeight: "calc(100vh - 104px)" 
        }}
      >
        {/* Background image with dim effect */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        {/* Subtle background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto flex-1 flex items-center justify-center">
          <div className="space-y-8 w-full">
            <h1
              className="font-martina font-normal text-[72px] leading-[72px] text-white mb-6"
            >
              Secure AI for
              <span className="block font-martina font-normal text-[72px] leading-[72px] text-white">
                Financial Professionals
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl font-br-sonoma-regular text-white/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              Domain-specific AI for investment banks, private equity firms, and hedge funds
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="bg-white text-black px-8 py-4 rounded-md font-br-sonoma-medium text-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-2">
                Request a Demo
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
        {/* Sliding Banner */}
        <div className="relative z-20 py-4">
          <div className="text-center mb-2">
            <span className="text-white/70 text-sm font-br-sonoma-regular">
              Trusted by leading financial institutions
            </span>
          </div>
          <div className="overflow-hidden relative">
            <div className="flex gap-16 animate-marquee whitespace-nowrap">
              <span className="text-2xl font-martina font-bold text-white">RAYMOND JAMES</span>
              <span className="text-2xl font-martina text-white">LAZARD</span>
              <span className="text-2xl font-martina text-white">TIGERGLOBAL</span>
              <span className="text-2xl font-martina font-bold text-white">RAYMOND JAMES</span>
              <span className="text-2xl font-martina text-white">LAZARD</span>
              <span className="text-2xl font-martina text-white">TIGERGLOBAL</span>
              <span className="text-2xl font-martina font-bold text-white">RAYMOND JAMES</span>
              <span className="text-2xl font-martina text-white">LAZARD</span>
              <span className="text-2xl font-martina text-white">TIGERGLOBAL</span>
              <span className="text-2xl font-martina font-bold text-white">RAYMOND JAMES</span>
              <span className="text-2xl font-martina text-white">LAZARD</span>
              <span className="text-2xl font-martina text-white">TIGERGLOBAL</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 