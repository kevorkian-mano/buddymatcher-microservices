import React from "react";
import Header from "../components/layout/Header";
import SignUpForm from "../components/auth/SignUpForm";

function SignUp() {
  return (
    <div className="overflow-hidden px-10 md:px-20 pt-10 md:pt-14 pb-20 md:pb-28 bg-white min-h-screen">
      <Header />

      <main className="flex flex-wrap gap-10 items-start w-full mt-4 max-md:flex-col">
        <SignUpForm />

        {/* Right-side decorative Welcome card */}
        <aside className="grow shrink self-stretch my-auto min-w-[300px] w-[580px] max-md:max-w-full max-md:w-full flex items-center justify-center">
          <div className="relative w-full max-w-[520px]">
            {/* Top-left sparkle */}
            <div className="absolute -top-6 left-[15%] text-zinc-800 text-[40px] leading-none select-none z-10" aria-hidden="true">
              ✧
            </div>

            {/* Top-right sparkle */}
            <div className="absolute -top-4 -right-2 text-zinc-800 text-[32px] leading-none select-none z-10" aria-hidden="true">
              ✧
            </div>

            {/* Main yellow card */}
            <div className="relative bg-[#efd476] rounded-[24px] border border-[#d4b85e] p-6 pt-5 pb-6 mt-4">
              {/* "Welcome!" heading */}
              <h3 className="text-5xl md:text-[56px] font-playfair italic font-bold text-zinc-900 mb-4 leading-[1.1]">
                Welcome!
              </h3>

              {/* Image container with offset border */}
              <div className="relative">
                <div className="absolute top-[10px] left-[-8px] right-[-8px] bottom-[-10px] border border-zinc-700 rounded-[20px]" />
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/d03b3af1ed25db54a69840eaff0d275e559bbbb3?width=876"
                  alt="Mastermind meeting"
                  className="relative w-full rounded-[20px] object-cover aspect-[1.6] border border-zinc-800 z-10"
                />
                {/* Sparkle on image */}
                <div className="absolute top-4 left-6 text-white text-[36px] leading-none z-20 drop-shadow-md select-none" aria-hidden="true">
                  ✧
                </div>
              </div>
            </div>

            {/* Bottom-right sparkle */}
            <div className="absolute -bottom-6 right-[10%] text-zinc-800 text-[36px] leading-none select-none z-10" aria-hidden="true">
              ✧
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default SignUp;