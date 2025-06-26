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
        <div className="absolute top-16 right-0 w-2/3 bg-white shadow-lg flex flex-col items-center space-y-6 py-6 z-50">
          <Link 
            href="#" 
            onClick={() => setOpen(false)}
            className="text-black text-sm leading-[21px] font-normal"
            style={{ 
              fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
              fontSize: '14px',
              lineHeight: '21px',
              fontWeight: 400
            }}
          >
            Product
          </Link>
          <Link 
            href="#" 
            onClick={() => setOpen(false)}
            className="text-black text-sm leading-[21px] font-normal"
            style={{ 
              fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
              fontSize: '14px',
              lineHeight: '21px',
              fontWeight: 400
            }}
          >
            Security
          </Link>
          <Link 
            href="#" 
            onClick={() => setOpen(false)}
            className="text-black text-sm leading-[21px] font-normal"
            style={{ 
              fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
              fontSize: '14px',
              lineHeight: '21px',
              fontWeight: 400
            }}
          >
            Company
          </Link>
          <Link 
            href="#" 
            onClick={() => setOpen(false)}
            className="text-black text-sm leading-[21px] font-normal"
            style={{ 
              fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
              fontSize: '14px',
              lineHeight: '21px',
              fontWeight: 400
            }}
          >
            News
          </Link>
          <Link 
            href="#" 
            onClick={() => setOpen(false)}
            className="text-black text-sm leading-[21px] font-normal"
            style={{ 
              fontFamily: '"BR Sonoma Regular", "BR Sonoma Regular Placeholder", sans-serif',
              fontSize: '14px',
              lineHeight: '21px',
              fontWeight: 400
            }}
          >
            Careers
          </Link>
          <Link 
            href="#" 
            className="text-black text-sm leading-[14px] font-normal"
            onClick={() => setOpen(false)}
            style={{ 
              fontFamily: '"BR Sonoma Medium", "BR Sonoma Medium Placeholder", sans-serif',
              fontSize: '14px',
              lineHeight: '14px',
              fontWeight: 400
            }}
          >
            Log in
          </Link>
        </div>
      )}
    </>
  );
}