import React from "react";

export function FormField({ label, type = "text", placeholder, required = false }) {
  return (
    <div className="mt-3.5 max-md:max-w-full">
      <label className="block text-xl text-zinc-800 max-md:max-w-full">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="flex mt-3.5 w-full rounded-xl border border-solid border-stone-700 min-h-[58px] px-4 max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-zinc-800"
      />
    </div>
  );
}
