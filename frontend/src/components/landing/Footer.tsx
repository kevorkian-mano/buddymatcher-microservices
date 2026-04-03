import * as React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="px-6 md:px-10 pt-10 pb-6">
      <div className="mx-auto max-w-[1220px] rounded-[30px] bg-zinc-800 px-7 md:px-12 py-10 md:py-12">
        <div className="flex flex-col md:flex-row gap-10 md:gap-14 justify-between items-stretch">
          <div className="flex-1 w-full">
            <h2 className="mb-8 text-[50px] leading-none font-playfair font-bold text-white tracking-[-0.02em]">
              buddymatcher
            </h2>
            <nav className="flex flex-col gap-3 font-worksans mb-10">
              <Link to="/" className="text-[22px] text-zinc-200 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/features" className="text-[22px] text-zinc-200 hover:text-white transition-colors">
                Features
              </Link>
              <Link to="/how-it-works" className="text-[22px] text-zinc-200 hover:text-white transition-colors">
                How It Works
              </Link>
            </nav>
            <div className="text-[17px] font-worksans text-zinc-400">
              © 2025 Alliatus. All rights reserved.
            </div>
            <div className="text-[17px] font-worksans text-zinc-400 mt-1">
              Powered by connection, clarity, and community.
            </div>
          </div>
          
          <aside className="flex-1 w-full bg-[#efd476] rounded-[20px] px-7 md:px-8 py-7 md:py-8 border border-[#e4ca6f]">
            <div className="flex justify-between items-start gap-5 mb-4">
              <h3 className="text-[58px] leading-[0.95] font-playfair text-zinc-900 tracking-[-0.015em]">
                Let’s Get <span className="italic font-semibold">Started!</span>
              </h3>
              <Link 
                to="/signup" 
                className="inline-block px-8 py-3 text-[22px] font-worksans font-medium text-white rounded-[10px] bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-900 whitespace-nowrap"
              >
                Join Now
              </Link>
            </div>
            <p className="mb-3 text-[23px] leading-[1.4] font-worksans text-zinc-900 max-w-[95%]">
              Join a supportive circle of minds and start growing with intention.
            </p>
            <p className="text-[23px] leading-[1.35] font-worksans text-zinc-900">
              There’s a seat at the table waiting for you.
            </p>
          </aside>
        </div>
      </div>
    </footer>
  );
}
