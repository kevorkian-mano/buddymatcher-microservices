import React from "react";

export function ProgressBar({ progress }) {
  return (
    <div className="flex-1 h-3.5 rounded-full border border-zinc-800 bg-white overflow-hidden">
      <div
        className="h-full bg-[#efd476] rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
