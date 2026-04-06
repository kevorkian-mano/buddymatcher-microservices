import React from "react";
import Header from "../components/layout/Header";
import SignInForm from "../components/auth/SignInForm";
import { Link } from "react-router-dom";

function SignIn() {
  return (
    <div className="overflow-hidden px-10 md:px-20 pt-10 md:pt-14 pb-20 md:pb-28 bg-white min-h-screen">
      <Header showProgress={false} />

      <main className="flex flex-wrap gap-10 items-start w-full mt-4 max-md:flex-col">
        <SignInForm />

        {/* Right-side decorative Promo card */}
        <aside className="grow shrink self-stretch my-auto min-w-[300px] w-[580px] max-md:max-w-full flex items-center justify-center">
          <div className="relative w-full max-w-[520px]">
            {/* Top-left sparkle */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/eed0076b8a912edb1603878394d8e074e30f7e64?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
              alt="Decorative illustration"
              className="object-contain absolute z-20 shrink-0 aspect-[0.66] -top-8 left-4 md:-left-4 h-[104px] w-[69px] rotate-[-15deg]"
            />

            {/* Top-right sparkle */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f67e14264a980a3c5b9ee5af02f650f5baa3ac3a?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
              alt="Decorative illustration"
              className="object-contain absolute z-20 shrink-0 aspect-[0.87] -top-6 -right-2 md:-right-6 h-[80px] w-[70px] rotate-[15deg]"
            />

            {/* Main yellow card */}
            <div className="relative bg-[#efd476] w-full max-w-[600px] min-h-[600px] mx-auto rounded-[32px] border border-[#d4b85e] p-10 md:p-16 flex flex-col items-center justify-center text-center mt-4">              <h2 className="text-[44px] md:text-[56px] font-playfair italic font-extrabold text-zinc-900 leading-[1.1]">
                Create Account!
              </h2>

              <p className="mt-6 md:mt-8 text-xl font-worksans text-zinc-800">
                Sign up if you still don&apos;t have an account
              </p>

              <div className="mt-10 md:mt-14 w-full">
                <Link to="/signup" className="flex justify-center items-center py-4 w-full text-[20px] font-worksans font-medium text-white bg-zinc-900 rounded-[12px] hover:bg-zinc-800 border border-zinc-900 transition-colors">
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Bottom-right sparkle */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f67e14264a980a3c5b9ee5af02f650f5baa3ac3a?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
              alt="Decorative illustration"
              className="object-contain absolute z-20 shrink-0 aspect-[0.87] -bottom-8 right-0 md:-right-8 h-[106px] w-[92px]"
            />
          </div>
        </aside>
      </main>
    </div>
  );
}

export default SignIn;
