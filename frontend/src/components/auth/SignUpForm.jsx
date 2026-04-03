import React from "react";
import { FormField } from "../common/FormField";

export default function SignUpForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In the future this will use Apollo to submit to backend
  };

  return (
    <section className="grow shrink self-stretch my-auto min-w-60 w-[482px] max-md:max-w-full">
      <h2 className="text-6xl font-playfair italic font-extrabold text-zinc-800 max-md:text-4xl">
        Sign up
      </h2>
      <p className="mt-5 text-lg font-worksans font-medium text-zinc-800">
        Create an account to continue
      </p>

      <form onSubmit={handleSubmit} className="mt-5 max-w-full w-[420px]">
        <FormField label="Full Name" type="text" required />
        <FormField label="Email" type="email" required />
        <FormField label="Birth of date" type="date" required />
        <FormField label="Phone Number" type="tel" required />
        <FormField label="Set Password" type="password" required />

        <button
          type="submit"
          className="mt-5 w-full py-4 text-lg font-worksans font-medium text-white bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2"
        >
          Continue
        </button>
      </form>
    </section>
  );
}