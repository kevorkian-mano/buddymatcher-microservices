import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Placeholder({ title }) {
  return (
    <div className="min-h-screen bg-white font-worksans flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-5 py-20">
        <div className="text-center max-w-lg">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl text-brand-dark mb-4">
            {title}
          </h1>
          <p className="font-worksans text-lg text-brand-dark/60 leading-relaxed mb-8">
            This page is coming soon. Continue prompting to add content here!
          </p>
          <Link
            to="/"
            className="inline-block font-worksans text-base text-white bg-brand-dark rounded-xl px-8 py-4 hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <div className="pb-12">
        <Footer />
      </div>
    </div>
  );
}