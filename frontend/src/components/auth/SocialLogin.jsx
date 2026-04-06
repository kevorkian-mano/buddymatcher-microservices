import React from "react";

export default function SocialLogin() {
  return (
    <div className="flex flex-col gap-4">
      <button className="flex overflow-hidden flex-wrap gap-2.5 justify-center items-center px-6 py-4 w-full bg-white rounded-[12px] border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all font-worksans text-base font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/b3e66fbf448dec220cdca0e95273c70d6cc35a92?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
          alt="Google logo"
          className="object-contain w-5 h-5 shrink-0"
        />
        <span>Continue with Google</span>
      </button>

      <button className="flex overflow-hidden flex-wrap gap-2.5 justify-center items-center px-6 py-4 w-full bg-white rounded-[12px] border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all font-worksans text-base font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/d1c653de0e83b1a8c77a977298c2ac11f95c4884?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
          alt="Facebook logo"
          className="object-contain w-5 h-5 shrink-0"
        />
        <span>Continue with Facebook</span>
      </button>
    </div>
  );
}
