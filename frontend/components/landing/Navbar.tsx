"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      setScrolled(scrollPosition > heroHeight - 100);

      if (scrollPosition > lastScrollY.current && scrollPosition > 50) {
        setShowBanner(false);
      } else if (scrollPosition < lastScrollY.current) {
        setShowBanner(true);
      }
      lastScrollY.current = scrollPosition;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={`
          fixed top-0 left-0 w-full z-[60] transition-transform duration-300
          ${showBanner ? "translate-y-0" : "-translate-y-10"}
        `}
      >
        <div
          className="bg-black text-white flex items-center px-6 h-10"
          style={{
            fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
            fontSize: "15px",
          }}
        >
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Rogo announces Series B&nbsp;
            <a
              href="#"
              className="underline mx-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read
            </a>
            <a
              href="#"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Financial Times
            </a>
          </span>
        </div>

        <nav
          className={`
            w-full transition-all border-b-2
            ${scrolled
              ? "bg-white shadow"
              : "bg-transparent backdrop-blur-md"}
          `}
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            borderBottomColor: "rgba(255,255,255,0.3)"
          }}
        >
          <div className="flex items-center justify-center w-full h-16 relative px-8">
            <div className="absolute left-0 flex-shrink-0 pl-0 ml-0 flex items-center h-full">
              <Link href="/" className="flex items-center h-full">
                <Image
                  src={scrolled ? "/images/rogo-logo-bl.png" : "/images/rogo-logo.png"}
                  alt="rogo logo"
                  width={90}
                  height={32}
                  style={{ objectFit: "contain" }}
                  priority
                />
              </Link>
            </div>

            <div className="hidden md:flex space-x-8">
              <Link 
                href="#" 
                className="text-sm leading-[21px] font-normal"
                style={{ 
                  fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
                  fontSize: '14px',
                  lineHeight: '21px',
                  fontWeight: 400,
                  color: scrolled ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'
                }}
              >
                Product
              </Link>
              <Link 
                href="#" 
                className="text-sm leading-[21px] font-normal"
                style={{ 
                  fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
                  fontSize: '14px',
                  lineHeight: '21px',
                  fontWeight: 400,
                  color: scrolled ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'
                }}
              >
                Security
              </Link>
              <Link 
                href="#" 
                className="text-sm leading-[21px] font-normal"
                style={{ 
                  fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
                  fontSize: '14px',
                  lineHeight: '21px',
                  fontWeight: 400,
                  color: scrolled ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'
                }}
              >
                Company
              </Link>
              <Link 
                href="#" 
                className="text-sm leading-[21px] font-normal"
                style={{ 
                  fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
                  fontSize: '14px',
                  lineHeight: '21px',
                  fontWeight: 400,
                  color: scrolled ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'
                }}
              >
                News
              </Link>
              <Link 
                href="#" 
                className="text-sm leading-[21px] font-normal"
                style={{ 
                  fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
                  fontSize: '14px',
                  lineHeight: '21px',
                  fontWeight: 400,
                  color: scrolled ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'
                }}
              >
                Careers
              </Link>
            </div>

            <div className="absolute right-0 hidden md:flex items-center space-x-4 pr-6">
              <Link 
                href="#" 
                className="text-sm leading-[14px] font-normal"
                style={{ 
                  fontFamily: '"BR Sonoma Medium", "BR Sonoma Medium Placeholder", sans-serif',
                  fontSize: '14px',
                  lineHeight: '14px',
                  fontWeight: 400,
                  color: scrolled ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'
                }}
              >
                Log in
              </Link>
              <Link 
                href="#" 
                className={`px-4 py-2 rounded-full text-sm leading-[14px] font-normal ${
                  scrolled ? 'bg-black text-white' : 'bg-white text-black'
                }`}
                style={{ 
                  fontFamily: '"BR Sonoma Medium", "BR Sonoma Medium Placeholder", sans-serif',
                  fontSize: '14px',
                  lineHeight: '14px',
                  fontWeight: 400
                }}
              >
                Request Demo
              </Link>
            </div>

            <div className="absolute right-0 flex md:hidden pr-4">
              <MobileMenu scrolled={scrolled} />
            </div>
          </div>
        </nav>
      </div>

      <div style={{ height: showBanner ? "104px" : "64px" }}></div>
    </>
  );
}

function MobileMenu({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [open]);

  return (
    <>
      <button
        className="text-3xl"
        style={{ color: scrolled ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)' }}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? "✕" : "≡"}
      </button>
      {open && (
        <div className="fixed inset-0 min-h-screen w-screen bg-black z-[9999] flex flex-col">
          {/* Header with logo and close button */}
          <div className="flex items-center justify-between p-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/rogo-logo.png"
                alt="rogo logo"
                width={90}
                height={32}
                style={{ objectFit: "contain" }}
                priority
              />
            </Link>
            <button
              className="text-white text-2xl"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Menu items */}
          <div className="flex flex-col flex-1 px-6 space-y-8 mt-8">
            <Link 
              href="#" 
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-gray-700 pb-4"
            >
              <span 
                className="text-white text-lg font-normal"
                style={{ 
                  fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
                }}
              >
                Product
              </span>
              <span className="text-gray-400 text-sm">01 /</span>
            </Link>
            
            <Link 
              href="#" 
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-gray-700 pb-4"
            >
              <span 
                className="text-white text-lg font-normal"
                style={{ 
                  fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
                }}
              >
                Security
              </span>
              <span className="text-gray-400 text-sm">02 /</span>
            </Link>
            
            <Link 
              href="#" 
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-gray-700 pb-4"
            >
              <span 
                className="text-white text-lg font-normal"
                style={{ 
                  fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
                }}
              >
                Company
              </span>
              <span className="text-gray-400 text-sm">03 /</span>
            </Link>
            
            <Link 
              href="#" 
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-gray-700 pb-4"
            >
              <span 
                className="text-white text-lg font-normal"
                style={{ 
                  fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
                }}
              >
                News
              </span>
              <span className="text-gray-400 text-sm">04 /</span>
            </Link>
            
            <Link 
              href="#" 
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-gray-700 pb-4"
            >
              <span 
                className="text-white text-lg font-normal"
                style={{ 
                  fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
                }}
              >
                Careers
              </span>
              <span className="text-gray-400 text-sm">05 /</span>
            </Link>
          </div>

          {/* Bottom buttons */}
          <div className="flex flex-col space-y-4 p-6 mt-auto">
            <Link 
              href="#" 
              onClick={() => setOpen(false)}
              className="w-full text-center py-3 text-white border border-gray-600 rounded-md hover:border-gray-500 transition-colors"
              style={{ 
                fontFamily: '"BR Sonoma Medium", "BR Sonoma Medium Placeholder", sans-serif',
                fontSize: '16px',
                fontWeight: 400
              }}
            >
              Log in
            </Link>
            <Link 
              href="#" 
              onClick={() => setOpen(false)}
              className="w-full text-center py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors"
              style={{ 
                fontFamily: '"BR Sonoma Medium", "BR Sonoma Medium Placeholder", sans-serif',
                fontSize: '16px',
                fontWeight: 400
              }}
            >
              Book Demo
            </Link>
          </div>
        </div>
      )}
    </>
  );
}