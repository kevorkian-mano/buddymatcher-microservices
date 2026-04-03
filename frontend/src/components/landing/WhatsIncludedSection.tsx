import * as React from "react";

export function WhatsIncludedSection() {
  const features = [
    "Private online community",
    "Goal-tracking and reflection tools",
    "Access to session recordings (optional for privacy)",
    "Session prep templates & prompts",
    "Library of expert resources",
  ];

  return (
    <section className="pt-10 pb-6 px-6 md:px-10">
      <div className="text-center">
        <h3 className="mb-7 text-[13px] font-worksans font-semibold tracking-[0.12em] uppercase text-zinc-600">
          WHAT'S INCLUDED
        </h3>
      </div>

      <ul className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3 text-[22px] font-worksans text-zinc-800">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </section>
  );
}
