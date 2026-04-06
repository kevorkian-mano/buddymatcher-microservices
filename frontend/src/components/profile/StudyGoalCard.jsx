import React from 'react';

export const StudyGoalCard = ({
  title,
  isSelected,
  onClick
}) => {
  return (
    <button
      className={`px-8 py-6 rounded-2xl border-2 cursor-pointer w-full transition-colors flex items-center justify-center ${
        isSelected ? 'border-zinc-900 bg-[#efd476]' : 'border-zinc-300 bg-white hover:border-zinc-400'
      }`}
      onClick={onClick}
      type="button"
    >
      <h3 className="text-xl font-worksans font-medium leading-8 text-center text-zinc-900">
        {title}
      </h3>
    </button>
  );
};
