import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission via Apollo
    console.log("Sign in attempt:", { email, password });
    // Redirect to dashboard on successful login
    navigate("/dashboard");
  };

  return (
    <section className="grow shrink self-stretch my-auto min-w-60 w-[482px] max-md:max-w-full">
      <h2 className="text-6xl font-playfair italic font-extrabold text-zinc-800 max-md:text-4xl">
        Sign in
      </h2>
      <p className="mt-5 text-lg font-worksans font-medium text-zinc-800">
        Enter your email and password to log in
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-full w-[420px]">
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-worksans font-medium text-zinc-800 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-solid border-stone-300 bg-white min-h-[58px] px-4 font-worksans focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-worksans font-medium text-zinc-800 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-solid border-stone-300 bg-white min-h-[58px] px-4 pr-16 font-worksans focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/8e995056e6fd61557d8f76e49435724b15d967c5?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
                  alt="Show password"
                  className="w-6 h-6 opacity-70"
                />
              </button>
            </div>
            <Link to="/forgot-password" className="inline-block mt-2 text-sm font-worksans text-zinc-600 hover:text-zinc-900 transition-colors">
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full py-4 text-lg font-worksans font-medium text-white bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2"
        >
          Log In
        </button>
      </form>

      <div className="mt-8 max-w-full w-[420px]">


      </div>

      <div className="flex gap-1.5 items-center mt-6 w-full text-base font-worksans max-w-[420px]">
        <span className="text-zinc-600">
          Don&apos;t have an account?
        </span>
        <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
          Sign Up
        </Link>
      </div>
    </section>
  );
}
