import React from 'react';

export const FreeDays = ({ days = ['Monday', 'Friday', 'Saturday'] }) => {
  return (
    <section className="w-full my-4">
      <h3 className="text-3xl font-playfair font-bold text-zinc-900 mb-4">
        Free days:
      </h3>
      <div className="flex flex-wrap gap-3 items-center text-lg font-worksans text-zinc-800">
        {days.map((day) => (
          <div
            key={day}
            className="px-5 py-2 border-2 border-black rounded-full font-medium shadow-[2px_2px_0px_#000] bg-white transition-transform hover:-translate-y-1"
          >
            {day}
          </div>
        ))}
      </div>
      

    </section>
  );
};