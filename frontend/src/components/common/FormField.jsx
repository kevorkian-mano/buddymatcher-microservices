import React from "react";

export function FormField({ label, type = "text", placeholder, required = false, value, onChange, name }) {
  return (
    <div className="mt-4">
      <label className="block text-base font-worksans font-medium text-zinc-800 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3.5 rounded-xl border border-zinc-400 bg-white text-base font-worksans text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 transition-colors"
      />
    </div>
  );
}
