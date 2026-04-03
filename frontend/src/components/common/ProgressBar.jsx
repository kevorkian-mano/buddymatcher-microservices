import React from "react";

export function ProgressBar({ progress }) {
  return (
    <div className="flex flex-col grow shrink items-start self-stretch my-auto rounded-xl border border-black border-solid bg-amber-200 bg-opacity-0 min-h-4 min-w-60 pr-[718px] w-[1088px] max-md:max-w-full">
      <div
        className="flex max-w-full bg-amber-200 rounded-xl border border-black border-solid min-h-4"
        style={{ width: `${progress}%`, minWidth: '409px' }}
      />
    </div>
  );
}
