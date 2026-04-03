import React from "react";
import { ProgressBar } from "../common/ProgressBar";

export default function Header() {
  return (
    <header className="w-full max-md:max-w-full">
      <div className="max-w-full w-[1335px]">
        <h1 className="text-4xl font-bold lowercase text-zinc-800 max-md:max-w-full">
          BUDDYMATCHER
        </h1>
        <nav className="flex flex-wrap gap-3 items-center mt-4 w-full max-md:max-w-full">
          <a
            href="/"
            className="flex grow shrink gap-1.5 self-stretch my-auto text-xl text-zinc-800 w-[158px] hover:opacity-80 transition-opacity"
          >
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/19e3d26f7ac54b5ec36064123bb17acdca5c817a?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
              alt="Back arrow"
              className="object-contain shrink-0 aspect-[0.89] w-[39px]"
            />
            <span className="my-auto basis-auto">
              Back to Home
            </span>
          </a>
          <ProgressBar progress={37.6} />
        </nav>
      </div>
    </header>
  );
}