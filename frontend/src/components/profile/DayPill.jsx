import React from 'react';

export const DayPill = ({ day, isSelected, onClick }) => {
  return (
    <button
      className={`px-6 py-3 rounded-full border-2 cursor-pointer transition-colors font-worksans text-base leading-6 ${
        isSelected ? 'border-zinc-900 bg-[#efd476] font-medium text-zinc-900' : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400'
      }`}
      onClick={onClick}
      type="button"
    >
      <span>{day}</span>
    </button>
  );
};
