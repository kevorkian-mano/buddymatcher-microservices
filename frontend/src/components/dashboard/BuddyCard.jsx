"use client";
import React, { useState } from 'react';

export const BuddyCard = ({
  name,
  field,
  school,
  year,
  matchPercentage,
  tags,
  subjects,
  avatar
}) => {
  const [clicked, setClicked] = useState(false);

  const handleConnect = () => {
    setClicked(true);
  };

  return (
    <div className="border border-gray-300 rounded-3xl p-6 relative flex flex-col hover:shadow-lg transition-shadow bg-white h-full w-full">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-2xl font-playfair text-zinc-900 font-bold mb-1">{name}</h3>
          <p className="text-gray-600 mb-1">{field}</p>
          <p className="text-sm text-gray-500 flex items-center">
            {school} · {year}
          </p>
        </div>
        <div className="text-right">
          <span className="text-gray-400 font-medium tracking-wide">{matchPercentage}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 mb-4">
        {tags[0] && <span className="px-4 py-1.5 bg-[#fcf8e3] text-sm text-gray-700 border border-[#d6a546] rounded-full">{tags[0]}</span>}
        <span className="px-4 py-1.5 bg-white text-sm text-gray-600 border border-gray-300 rounded-full">{subjects.length} mutual topics</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {subjects?.map((topic, i) => (
          <span key={i} className="px-4 py-1 border border-gray-300 rounded-full text-xs text-gray-500">{topic}</span>
        ))}
      </div>

      <div className="mt-auto flex justify-between items-center space-x-3">
        <button 
          className={`flex-1 py-2.5 rounded-full text-sm font-medium flex justify-center items-center ${clicked ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#1a1a1a] text-white hover:bg-black'}`}
          onClick={handleConnect}
          disabled={clicked}
        >
          {clicked ? "Requested" : <><span className="mr-1">+</span> Connect</>}
        </button>
      </div>
    </div>
  );
};