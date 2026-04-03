import * as React from "react";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <article className="p-6 md:p-7 rounded-[20px] border border-zinc-500 bg-[#f5f5f5] min-h-[170px]">
      <div className="flex gap-3 items-start mb-3">
        <div className="text-[52px] leading-none font-playfair italic font-black text-zinc-900">
          {number}
        </div>
        <h4 className="mt-2 text-[14px] font-worksans font-semibold tracking-[0.11em] uppercase text-zinc-900">
          {title}
        </h4>
      </div>
      <p className="text-[20px] font-worksans leading-[1.45] text-zinc-800">
        {description}
      </p>
    </article>
  );
}

export function HowItWorksSection() {
  return (
    <section className="pt-16 md:pt-14 pb-7 px-6 md:px-10">
      <div>
        <h3 className="mb-4 text-[13px] font-worksans font-semibold tracking-[0.12em] uppercase text-zinc-600 text-left">
          HOW IT WORKS
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <StepCard
          number="01"
          title="APPLY ONLINE"
          description="Tell us about your goals, background, and what kind of support you're seeking."
        />
        <StepCard
          number="02"
          title="GET MATCHED"
          description="We carefully place you in a mastermind circle of 5–6 aligned members."
        />
        <StepCard
          number="03"
          title="JOIN BI-WEEKLY SESSIONS"
          description="Meet over Zoom for structured, focused conversations led by a trained host."
        />
      </div>
    </section>
  );
}
