import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, User } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_MY_NOTIFICATIONS } from '../../graphql/queries/notificationQueries';
import { GET_ALL_USERS } from '../../graphql/queries/userQueries';
import { GET_SESSIONS } from '../../graphql/queries/sessionQueries';

export const Header = ({ userName, searchQuery: externalSearchQuery, onSearchChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const { data: notifData } = useQuery(GET_MY_NOTIFICATIONS, {
    pollInterval: 10000,
    fetchPolicy: 'network-only'
  });
  const unreadCount = notifData?.getMyNotifications?.filter(n => !n.read)?.length || 0;

  const { data: usersData } = useQuery(GET_ALL_USERS, {
    fetchPolicy: 'cache-first'
  });

  const { data: sessionsData } = useQuery(GET_SESSIONS, {
    fetchPolicy: 'cache-first'
  });

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
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  // Search Logic
  const displaySearch = externalSearchQuery !== undefined ? externalSearchQuery : localSearch;
  const isSearching = searchFocused && displaySearch.trim().length > 0;
  const lowerQuery = displaySearch.toLowerCase();

  const allBuddies = usersData?.getAllUsers || [];
  const allSessions = sessionsData?.getSessions || [];

  const searchBuddies = isSearching ? allBuddies.filter(u => 
    u.id !== currentUser.id && u.name && u.name.toLowerCase().includes(lowerQuery)
  ) : [];

  const searchSessions = isSearching ? allSessions.filter(s => {
    // Only available to join ones (not created by me, and not already joined)
    if (s.creatorId === currentUser.id) return false;
    if (s.participants?.some(p => p.userId === currentUser.id)) return false;
    return s.topic && s.topic.toLowerCase().includes(lowerQuery);
  }) : [];

  return (
    <header className="flex flex-wrap gap-4 md:gap-8 items-center justify-between w-full max-md:max-w-full">
      <h1 className="text-3xl md:text-4xl font-playfair font-extrabold italic lowercase text-zinc-900 tracking-tight shrink-0">
        buddymatcher
      </h1>
      <div className="grow shrink min-w-0 md:min-w-[300px] lg:min-w-[600px] text-xl rounded-none text-zinc-800 max-w-[703px] max-md:max-w-full relative" ref={searchContainerRef}>
        <div className="flex items-center gap-4 px-5 py-3.5 rounded-xl border border-solid border-stone-300 max-md:px-5 bg-white focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-colors">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/18811d22910e79fa42b004c7a421677ba5e619bc?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
            className="object-contain shrink-0 my-auto w-6 aspect-square opacity-60"
            alt="Search icon"
          />
          <input
            type="text"
            value={displaySearch}
            onChange={handleSearchChange}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search Buddies, Subject, Sessions....."
            className="flex-auto w-full bg-transparent outline-none font-worksans text-lg placeholder-zinc-400"
          />
        </div>
        
        {/* Search Results Dropdown */}
        {isSearching && (searchBuddies.length > 0 || searchSessions.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl max-h-96 overflow-y-auto z-50">
            {searchBuddies.length > 0 && (
              <div className="p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Buddies</h3>
                <div className="flex flex-col gap-2">
                  {searchBuddies.map(user => (
                    <div 
                      key={user.id} 
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => {
                        setSearchFocused(false);
                        navigate(`/buddies/${user.id}`);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold text-sm">
                        {user.name[0]?.toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.major || 'Unknown Major'} - {user.university || 'Unknown Uni'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {searchBuddies.length > 0 && searchSessions.length > 0 && <div className="h-px bg-gray-100 mx-4" />}
            
            {searchSessions.length > 0 && (
              <div className="p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Available Sessions</h3>
                <div className="flex flex-col gap-2">
                  {searchSessions.map(session => (
                    <div 
                      key={session.id} 
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchFocused(false);
                        navigate(`/sessions/${session.id}`);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{session.topic}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          {session.sessionType || 'Unknown Type'} • {session.duration}m
                        </span>
                      </div>
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Join</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-row gap-4 md:gap-6 items-center shrink-0">
        {/* Messages */}
        <Link
          to="/messages"
          className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-stone-300 hover:bg-stone-100 transition-colors shadow-sm bg-white"
          title="Messages"
        >
          <MessageSquare className="w-5 h-5 text-zinc-700" />
        </Link>

        {/* Notifications Bell with unread badge */}
        <div className="relative">
          <Link
            to="/notifications"
            className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-stone-300 hover:bg-stone-100 transition-colors shadow-sm bg-white"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-zinc-700" />
          </Link>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 pointer-events-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>

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