import React from "react";
import { FormField } from "../common/FormField";

export default function SignUpForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In the future this will use Apollo to submit to backend
  };

  return (
    <section className="grow shrink self-stretch my-auto min-w-60 w-[482px] max-md:max-w-full">
      <h2 className="text-6xl italic font-extrabold text-zinc-800 max-md:max-w-full max-md:text-4xl">
        Sign up
      </h2>
      <p className="mt-6 text-xl text-zinc-800 max-md:max-w-full">
        Create an account to continue
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-full w-[494px]">
        <FormField
          label="Full Name"
          type="text"
          required
        />

        <FormField
          label="Email"
          type="email"
          required
        />

        <FormField
          label="Birth of date"
          type="date"
          required
        />

        <FormField
          label="Phone Number"
          type="tel"
          required
        />

        <FormField
          label="Set Password"
          type="password"
          required
        />

        <button
          type="submit"
          className="flex relative gap-2.5 justify-center items-start px-10 py-5 mt-3.5 w-full text-xl text-white whitespace-nowrap min-h-[60px] max-md:px-5 max-md:max-w-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800"
        >
          <div className="flex absolute inset-0 z-0 shrink-0 self-start rounded-xl bg-zinc-800 h-[60px] min-w-60 w-[494px] max-md:max-w-full" />
          <span className="z-0 my-auto">
            Continue
          </span>
        </button>
      </form>
    </section>
  );
}