import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-4 md:py-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-playfair font-bold text-2xl md:text-[40px] text-brand-dark lowercase tracking-tight">
          buddymatcher
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-worksans text-lg text-brand-dark hover:opacity-70 transition-opacity">
            Home
          </Link>
          <Link to="/features" className="font-worksans text-lg text-brand-dark hover:opacity-70 transition-opacity">
            Features
          </Link>
          <Link to="/how-it-works" className="font-worksans text-lg text-brand-dark hover:opacity-70 transition-opacity">
            How it works
          </Link>
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/login" className="font-worksans text-lg text-white bg-brand-dark rounded-xl px-8 py-3 hover:opacity-90 transition-opacity">
            Sign In
          </Link>
          <Link to="/signup" className="font-worksans text-lg text-brand-dark border border-[#49342F] rounded-xl px-8 py-3 hover:opacity-70 transition-opacity">
            Sign Up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-brand-dark transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-brand-dark transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-brand-dark transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-6 flex flex-col gap-4">
          <Link to="/" className="font-worksans text-lg text-brand-dark" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/features" className="font-worksans text-lg text-brand-dark" onClick={() => setMobileOpen(false)}>Features</Link>
          <Link to="/how-it-works" className="font-worksans text-lg text-brand-dark" onClick={() => setMobileOpen(false)}>How it works</Link>
          <div className="flex flex-col gap-3 pt-2">
            <Link to="/login" className="text-center font-worksans text-base text-white bg-brand-dark rounded-xl px-8 py-3 hover:opacity-90 transition-opacity">
              Sign In
            </Link>
            <Link to="/signup" className="text-center font-worksans text-base text-brand-dark border border-[#49342F] rounded-xl px-8 py-3 hover:opacity-70 transition-opacity">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}