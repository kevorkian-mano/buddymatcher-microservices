import React from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from "../common/ProgressBar";

export default function Header() {
  return (
    <header className="w-full mb-6">
      <h1 className="text-4xl font-playfair font-bold text-zinc-800 mb-4">
        buddymatcher
      </h1>
      <nav className="flex items-center gap-4 w-full">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-lg font-worksans text-zinc-800 hover:opacity-80 transition-opacity shrink-0"
        >
          <span className="text-xl">←</span>
          <span>Back to Home</span>
        </Link>
        <ProgressBar progress={37.6} />
      </nav>
    </header>
  );
}