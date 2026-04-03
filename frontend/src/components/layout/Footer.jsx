import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="px-5 md:px-10 mt-10">
      <div className="max-w-[1440px] mx-auto relative group">
        <div className="bg-[#292929] rounded-[40px] px-8 sm:px-12 md:px-16 pt-16 pb-14 min-h-[400px]">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16 lg:gap-0 lg:justify-between w-full h-full relative">
            
            {/* Left: Logo + Nav + Copyright */}
            <div className="flex flex-col gap-10 lg:w-1/3">
              <Link to="/" className="font-playfair font-bold text-3xl md:text-[40px] text-white lowercase">
                buddymatcher
              </Link>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <Link to="/" className="font-worksans text-sm text-white hover:text-brand-yellow transition-colors">
                    Home
                  </Link>
                  <Link to="/features" className="font-worksans text-sm text-white hover:text-brand-yellow transition-colors">
                    Features
                  </Link>
                  <Link to="/how-it-works" className="font-worksans text-sm text-white hover:text-brand-yellow transition-colors">
                    How It Works
                  </Link>
                </div>
                <div className="font-worksans text-xs text-white/80 leading-[1.6]">
                  <p>© 2025 Alliatus. All rights reserved.</p>
                  <p>Powered by connection, clarity, and community.</p>
                </div>
              </div>
            </div>

            {/* Right: CTA Card Overlapping Inside Footer */}
            <div className="lg:w-[50%] w-full bg-brand-yellow rounded-[24px] px-8 sm:px-12 py-12 lg:absolute right-10 top-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <h2 className="font-playfair text-3xl md:text-[45px] text-brand-dark leading-tight flex gap-2">
                  <span className="font-normal text-brand-dark">Let&apos;s Get</span>
                  <span className="font-black italic text-brand-dark">Started!</span>
                </h2>
                <Link to="/signup" className="font-worksans text-sm md:text-base text-white bg-brand-dark rounded-md px-8 py-3 hover:opacity-90 transition-opacity flex-shrink-0 self-start text-center">
                  Join Now
                </Link>
              </div>
              <div className="mt-8 flex flex-col gap-4 max-w-sm">
                <p className="font-worksans text-xs md:text-sm text-brand-dark leading-relaxed">
                  Join a supportive circle of minds and start growing with intention.
                </p>
                <p className="font-worksans text-xs md:text-sm text-brand-dark leading-relaxed">
                  There&apos;s a seat at the table waiting for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
