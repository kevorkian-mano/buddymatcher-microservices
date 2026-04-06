import React, { useState } from 'react';

export const FormFields = ({
  university,
  major,
  year,
  onUniversityChange,
  onMajorChange,
  onYearChange
}) => {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const yearOptions = [
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year',
    'Graduate',
    'PhD'
  ];

  return (
    <section className="mt-8 max-w-full w-[1007px]">
      <div className="max-md:max-w-full">
        <label htmlFor="university" className="block text-base font-worksans font-medium text-zinc-800 mb-1.5">
          University/ Institution
        </label>
        <input
          id="university"
          type="text"
          value={university}
          onChange={(e) => onUniversityChange(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl border border-zinc-400 bg-white text-base font-worksans text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 transition-colors"
        />
      </div>

      <div className="mt-4 max-md:max-w-full">
        <label htmlFor="major" className="block text-base font-worksans font-medium text-zinc-800 mb-1.5">
          Major/ Field of study
        </label>
        <input
          id="major"
          type="text"
          value={major}
          onChange={(e) => onMajorChange(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl border border-zinc-400 bg-white text-base font-worksans text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 transition-colors"
        />
      </div>

      <div className="mt-4 max-md:max-w-full">
        <label htmlFor="year" className="block text-base font-worksans font-medium text-zinc-800 mb-1.5">
          Year of Study
        </label>
        <div className="relative max-w-full w-full">
          <button
            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
            className="w-full px-4 py-3.5 rounded-xl border border-zinc-400 bg-white text-base font-worksans text-left text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 transition-colors flex flex-col justify-center"
          >
            <span>{year || 'Select a Year'}</span>
          </button>

          {isYearDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-400 rounded-xl shadow-lg z-10 overflow-hidden font-worksans text-base text-zinc-800">
              {yearOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onYearChange(option);
                    setIsYearDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-3.5 text-left hover:bg-gray-50 border-b border-zinc-100 last:border-0"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
