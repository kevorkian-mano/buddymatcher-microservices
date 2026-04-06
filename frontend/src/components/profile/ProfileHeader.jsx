import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfileHeader = ({ user }) => {
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const name = user?.name || "User";
  const university = user?.university || "University";
  const major = user?.major || "General Studies";
  const year = user?.academicYear || "Year N/A";
  const bio = user?.contactInfo ? `Contact: ${user.contactInfo}` : "Passionate student looking for collaborative learning and motivated study partners!";

  return (
    <header className="flex flex-col w-full">
      <h1 className="text-[36px] md:text-[44px] font-playfair italic font-extrabold text-zinc-900 leading-[1.1] mb-6">
        My Profile
      </h1>
      
      <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center bg-white p-6 md:p-8 rounded-3xl border-2 border-black relative shadow-[4px_4px_0px_#000]">
        
        {/* Avatar Placeholder */}
        <div className="shrink-0 w-[120px] md:w-[150px] aspect-square rounded-full border-4 border-black overflow-hidden bg-amber-100 flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-extrabold text-zinc-900">{getInitials(name)}</h2>
        </div>

        <div className="flex flex-col flex-1 w-full">
          <h2 className="text-3xl md:text-4xl text-zinc-900 font-playfair font-bold">
            {name}
          </h2>
          
          <div className="flex flex-wrap gap-2 items-center text-lg font-worksans text-zinc-600 mt-2 mb-4">
            <span className="flex items-center gap-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {university}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>{major}</span>
            <span className="hidden sm:inline">•</span>
            <span>{year}</span>
          </div>

          <p className="text-base md:text-lg font-worksans leading-relaxed text-zinc-800">
            {bio}
          </p>
        </div>

        {/* Edit Button */}
        <button 
          onClick={() => navigate('/edit-profile')}
          className="md:absolute top-8 right-8 flex items-center justify-center px-6 py-3 bg-zinc-900 text-white rounded-xl text-lg font-worksans font-medium hover:bg-zinc-800 transition-colors"
        >
          Edit Profile
        </button>
      </div>
    </header>
  );
};