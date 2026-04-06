import React from 'react';

import { Link } from 'react-router-dom';

export const Header = ({ userName }) => {
  return (
    <header className="flex flex-wrap gap-4 md:gap-8 items-center justify-between w-full max-md:max-w-full">
      <h1 className="text-3xl md:text-4xl font-playfair font-extrabold italic lowercase text-zinc-900 tracking-tight shrink-0">
        buddymatcher
      </h1>
      <div className="grow shrink min-w-0 md:min-w-[300px] lg:min-w-[600px] text-xl rounded-none text-zinc-800 max-w-[703px] max-md:max-w-full">
        <div className="flex items-center gap-4 px-5 py-3.5 rounded-xl border border-solid border-stone-300 max-md:px-5 bg-white focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-colors">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/18811d22910e79fa42b004c7a421677ba5e619bc?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
            className="object-contain shrink-0 my-auto w-6 aspect-square opacity-60"
            alt="Search icon"
          />
          <input
            type="text"
            placeholder="Search Buddies, Subject, Sessions....."
            className="flex-auto w-full bg-transparent outline-none font-worksans text-lg placeholder-zinc-400"
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 md:gap-6 items-center shrink-0">
        {/* Notifications Icon linking to /notifications */}
        <Link to="/notifications" className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-stone-300 hover:bg-stone-100 transition-colors shadow-sm bg-white" title="Notifications">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </Link>

        {/* Profile Avatar linking to /profile */}
        <Link to="/profile" className="cursor-pointer hover:opacity-80 transition-opacity" title="My Profile">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/2d75665f4bea8a767dd1901f18a4ce99e80b63fe?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
            className="object-cover self-stretch aspect-square rounded-full w-[57px] border-2 border-zinc-900"
            alt={`${userName} profile`}
          />
        </Link>
      </div>
    </header>
  );
};