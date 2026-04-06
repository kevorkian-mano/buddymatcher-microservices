import React from 'react';

export const FreeDays = ({ days = ['Monday', 'Friday', 'Saturday'] }) => {
  return (
    <section className="w-full my-10">
      <h3 className="text-3xl font-playfair font-bold text-zinc-900 mb-6">
        Free days:
      </h3>
      <div className="flex flex-wrap gap-4 items-center text-lg font-worksans text-zinc-800">
        {days.map((day) => (
          <div
            key={day}
            className="px-6 py-3 border-2 border-black rounded-full font-medium shadow-[2px_2px_0px_#000] bg-white transition-transform hover:-translate-y-1"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Optional schedule visualization if desired */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/a6b6cc14addf1d02566dd1639abed4d358093210?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
        className="w-full mt-10 rounded-3xl border-2 border-black max-w-[800px] object-cover aspect-[4/1] shadow-[6px_6px_0px_#000]"
        alt="Schedule visualization"
      />
    </section>
  );
};