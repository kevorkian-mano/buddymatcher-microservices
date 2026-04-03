import * as React from "react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="overflow-hidden relative px-7 md:px-14 py-10 md:py-14 mx-6 md:mx-10 mt-4 bg-[#efd476] rounded-[28px] border border-[#e4ca6f]">
      <div className="flex gap-10 md:gap-14 justify-between items-center max-md:flex-col max-md:items-start">
        <div className="flex-1 max-md:w-full md:pt-2 md:max-w-[52%]">
          <h2 className="mb-1 text-[46px] md:text-[72px] font-playfair font-black italic text-zinc-900 leading-[0.95] tracking-[-0.02em]">
            match
          </h2>
          <h2 className="text-[42px] md:text-[66px] font-playfair text-zinc-900 leading-[1.03] tracking-[-0.02em]">
            with a Curated
          </h2>
          <h2 className="mb-6 text-[42px] md:text-[66px] font-playfair text-zinc-900 leading-[1.03] tracking-[-0.02em]">
            Mastermind Circle
          </h2>
          <p className="mb-9 text-[18px] md:text-[20px] leading-[1.45] max-w-[560px] font-worksans text-zinc-800">
            buddymatcher connects ambitious people into small, handpicked groups
            for honest feedback, strategy sessions, and real accountability.
          </p>
          <div className="flex gap-3 items-center max-sm:flex-col max-sm:w-full">
            <Link to="/signup" className="px-10 py-3.5 font-worksans text-[16px] font-medium text-white rounded-[10px] bg-zinc-900 border border-zinc-900 hover:bg-zinc-800 transition-colors max-sm:w-full max-sm:text-center shrink-0">
              Join Now
            </Link>
            <Link to="/how-it-works" className="px-10 py-3.5 font-worksans text-[16px] font-medium bg-transparent rounded-[10px] border border-zinc-500 text-zinc-900 hover:bg-white/30 transition-colors max-sm:w-full max-sm:text-center">
              Learn How It Works
            </Link>
          </div>
        </div>
        
        <div className="relative flex-1 flex justify-center md:justify-end max-md:w-full">
          <div className="relative h-[470px] w-[355px] md:h-[525px] md:w-[395px] max-sm:h-[420px] max-sm:w-[300px]">
            <div className="absolute top-[18px] left-[-16px] right-0 bottom-[-16px] border border-zinc-700 rounded-[32px]" />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/d03b3af1ed25db54a69840eaff0d275e559bbbb3?width=876"
              alt="Mastermind meeting"
              className="absolute inset-0 w-full h-full rounded-[32px] object-cover border border-zinc-800 z-10"
            />

            <div className="absolute left-[34px] top-[54px] text-white text-[46px] leading-none z-20 drop-shadow-md" aria-hidden="true">
              ✧
            </div>

            <div className="absolute -right-8 md:-right-10 top-[66px] px-5 py-2.5 text-[14px] font-worksans font-medium bg-white rounded-full border border-zinc-300 text-zinc-900 z-20"
            >
              Fresh insights.
            </div>
            
            <div className="absolute -right-7 md:-right-9 px-5 py-2.5 text-[14px] font-worksans font-medium bg-white rounded-full border border-zinc-300 bottom-[120px] md:bottom-[112px] text-zinc-900 z-20"
            >
              Collective growth.
            </div>
            
            <div className="absolute bottom-7 left-[-24px] md:left-[-46px] px-5 py-2.5 text-[14px] font-worksans font-medium bg-white rounded-full border border-zinc-300 text-zinc-900 z-20"
            >
              Real conversations.

            </div>

            <div className="absolute right-[18px] bottom-[28px] text-white text-[56px] leading-none z-20 drop-shadow-md" aria-hidden="true">
              ✧
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
