import React from 'react';

export const SessionCard = ({
  title,
  date,
  time,
  location,
  isOnline = false
}) => {
  return (
    <article className="mt-4 w-full rounded-[2.5rem] bg-white border border-gray-300 p-8 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-4xl font-playfair text-zinc-800 max-w-[70%]">
          {title}
        </h3>
        <div className="bg-black text-white px-5 py-2 rounded-full flex items-center text-xs tracking-wide">
          <div className="w-1.5 h-1.5 rounded-full mr-2 bg-green-400 animate-pulse"></div>
          Upcoming
        </div>
      </div>
      
      <div className="flex flex-wrap gap-8 text-gray-600 mb-2 font-medium">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          {date}
        </div>
        
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {time}
        </div>
        
        <div className="flex items-center">
          {isOnline ? (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          )}
          <span className={isOnline ? "text-gray-600" : "text-gray-600"}>
            {location}
          </span>
        </div>
      </div>
    </article>
  );
};