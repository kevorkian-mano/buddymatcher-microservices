"use client";
import * as React from "react";
import { Header } from "../components/landing/Header";
import { HeroSection } from "../components/landing/HeroSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { WhatsIncludedSection } from "../components/landing/WhatsIncludedSection";
import { Footer } from "../components/landing/Footer";

function BuddyMatcherLanding() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <div className="min-h-screen bg-[#f5f5f5] pb-10">
        <Header />
        <main className="mx-auto max-w-[1220px]">
          <HeroSection />
          <HowItWorksSection />
          <WhatsIncludedSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default BuddyMatcherLanding;
