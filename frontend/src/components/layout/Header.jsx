import React from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../common/ProgressBar";

export default function Header({ showProgress = true, progress = 37.6 }) {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="w-full mb-6">
      <h1 className="text-4xl font-playfair font-bold text-zinc-800 mb-4">
        buddymatcher
      </h1>
      <nav className="flex items-center gap-4 w-full">
        <a
          href="/"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-lg font-worksans text-zinc-800 hover:opacity-80 transition-opacity shrink-0 cursor-pointer"
        >
          <span className="text-xl">←</span>
          <span>Back to Home</span>
        </a>
        {showProgress && <ProgressBar progress={progress} />}
      </nav>
    </header>
  );
}