import React from 'react';

export const StatsCard = ({ value, label, unit }) => {
  return (
    <div className="self-stretch my-auto rounded-[24px] min-w-60 w-[326px] bg-white cursor-pointer hover:-translate-y-1 transition-transform">
      <div className="flex flex-col justify-center items-start px-8 py-7 rounded-[24px] border border-solid border-zinc-800 max-md:px-5 shadow-sm">
        <div className="text-xl leading-8 text-zinc-800 font-worksans">
          <span className="text-[44px] font-playfair italic font-extrabold">{value}</span>
          {unit && <span className="font-playfair italic text-3xl font-bold ml-1">{unit}</span>}
          <br />
          <span className="font-medium text-lg">{label}</span>
        </div>
      </div>
    </div>
  );
};