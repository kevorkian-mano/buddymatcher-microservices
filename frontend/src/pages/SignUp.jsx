import React from "react";
import Header from "../components/layout/Header";
import SignUpForm from "../components/auth/SignUpForm";

function SignUp() {
  return (
    <div className="overflow-hidden px-20 pt-14 pb-28 bg-white max-md:px-5 max-md:pb-24">
      <Header />

      <main className="flex flex-wrap items-center w-full text-xl text-zinc-800 max-md:max-w-full">
        <SignUpForm />

        <aside className="grow shrink self-stretch my-auto min-w-60 w-[685px] max-md:max-w-full">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/4785af40b3a7fd4db84a6d18633b1530dbaf721f?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
            alt="Sign up illustration"
            className="object-contain grow shrink self-stretch my-auto rounded-none aspect-[1.01] min-w-60 w-[685px] max-md:max-w-full"
          />
        </aside>
      </main>
    </div>
  );
}

export default SignUp;