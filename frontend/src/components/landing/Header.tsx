"use client";
import * as React from "react";
import { Link } from "react-router-dom";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="px-6 md:px-10 pt-8 pb-4 mx-auto w-full max-w-[1220px] flex justify-between items-center">
      <Link to="/" className="text-[44px] leading-none font-playfair font-bold text-zinc-900 tracking-[-0.02em]">
        buddymatcher
      </Link>
      
      <nav className="hidden lg:flex gap-10 items-center font-worksans font-medium text-[16px] text-zinc-700">
        <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
        <Link to="/features" className="hover:text-zinc-900 transition-colors">Features</Link>
        <Link to="/how-it-works" className="hover:text-zinc-900 transition-colors">How it works</Link>
      </nav>
      
      <div className="hidden lg:flex gap-3 items-center font-worksans text-base font-medium">
        <Link to="/login" className="px-10 py-3 text-white bg-zinc-900 hover:bg-zinc-800 rounded-[10px] transition-colors border border-zinc-900">
          Sign In
        </Link>
        <Link to="/signup" className="px-10 py-3 bg-transparent border border-zinc-400 text-zinc-900 rounded-[10px] hover:bg-white transition-colors">
          Sign Up
        </Link>
      </div>

      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden flex flex-col gap-1.5 p-2 z-50">
        <div className={`w-6 h-0.5 bg-zinc-900 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <div className={`w-6 h-0.5 bg-zinc-900 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
        <div className={`w-6 h-0.5 bg-zinc-900 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-[92px] left-4 right-4 bg-white p-6 shadow-2xl rounded-2xl flex flex-col gap-4 border border-zinc-200 lg:hidden z-50">
          <Link to="/" className="font-worksans font-medium text-zinc-700 py-2 border-b border-zinc-100" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/features" className="font-worksans font-medium text-zinc-700 py-2 border-b border-zinc-100" onClick={() => setMobileMenuOpen(false)}>Features</Link>
          <Link to="/how-it-works" className="font-worksans font-medium text-zinc-700 py-2 border-b border-zinc-100" onClick={() => setMobileMenuOpen(false)}>How it works</Link>
          <div className="flex flex-col gap-3 mt-4">
            <Link to="/login" className="text-center w-full px-5 py-3 text-white bg-zinc-900 rounded-xl font-semibold" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            <Link to="/signup" className="text-center w-full px-5 py-3 bg-white border border-zinc-300 text-zinc-900 rounded-xl font-semibold" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  );
}
