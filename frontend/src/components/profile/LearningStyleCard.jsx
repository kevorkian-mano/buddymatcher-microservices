import React from 'react';

export const LearningStyleCard = ({
  title,
  description,
  isSelected,
  onClick
}) => {
  return (
    <button
      className={`px-8 py-6 rounded-2xl border-2 cursor-pointer bg-white w-full text-left transition-colors flex flex-col items-center justify-center ${
        isSelected ? 'border-zinc-900 bg-[#efd476]' : 'border-zinc-300 hover:border-zinc-400'
      }`}
      onClick={onClick}
      type="button"
    >
      <h3 className="mb-2 text-2xl font-worksans font-semibold leading-8 text-center text-zinc-900">
        {title}
      </h3>
      <p className="text-sm font-worksans leading-5 text-center text-zinc-600">
        {description}
      </p>
    </button>
  );
};
