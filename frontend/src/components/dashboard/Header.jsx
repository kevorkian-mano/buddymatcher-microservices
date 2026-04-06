import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, User } from 'lucide-react';

export const Header = ({ userName }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <Link to="/messages" className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-stone-300 hover:bg-stone-100 transition-colors shadow-sm bg-white" title="Messages">
          <MessageSquare className="w-5 h-5 text-zinc-700" />
        </Link>
        <Link to="/notifications" className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-stone-300 hover:bg-stone-100 transition-colors shadow-sm bg-white" title="Notifications">
          <Bell className="w-5 h-5 text-zinc-700" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-stone-300 hover:bg-stone-100 transition-colors shadow-sm bg-white focus:outline-none"
            title="Profile Menu"
          >
            <User className="w-5 h-5 text-zinc-700" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-zinc-200 overflow-hidden z-50">
              <div className="py-2">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2.5 text-sm font-worksans text-zinc-800 font-medium hover:bg-stone-100 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <div className="h-px bg-zinc-200 my-1"></div>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2.5 text-sm font-worksans font-medium text-red-600 hover:bg-red-50 transition-colors focus:outline-none"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};