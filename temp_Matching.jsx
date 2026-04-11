import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Breadcrumb, Sidebar } from '../components/dashboard';

const Matching = () => {
  const [currentView, setCurrentView] = useState('suggestions');
  const [user, setUser] = useState({ name: "Alex" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="overflow-hidden pr-6 md:pr-8 lg:pr-12 pl-0 pt-4 md:pt-6 pb-20 md:pb-28 bg-white min-h-screen relative">
      <div className="max-w-[1800px] mx-auto z-10 relative flex flex-col w-full h-full">
        {/* Header section - Spans full width! */}
        <div className="w-full flex flex-col mb-10 pl-6 md:pl-8 lg:pl-12">
          <Header userName={user.name} />
          {/* Using matching breadcrumb or omitting if not needed. Adding it for consistency with layout */}
          <div className="mt-4"><Breadcrumb /></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
          {/* Sidebar Area */}
          <div className="hidden lg:block w-[300px] shrink-0 sticky top-6">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 w-full min-w-0 px-4 md:px-8">
            <main className="flex-1 overflow-y-auto">
              {currentView === 'suggestions' && <SuggestionsView />}
              {currentView === 'requests' && <RequestsView />}
              {currentView === 'connections' && <ConnectionsView />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matching;

const SuggestionsView = () => {
  return (
    <div className="max-w-4xl font-worksans">
      <h2 className="text-[44px] md:text-[56px] font-playfair font-extrabold italic text-zinc-900 leading-[1.1] mb-6">Find Study Buddies</h2>
      <p className="text-zinc-600 mb-8 text-lg">Discover 6+ compatible study partners matched to your profile</p>
      
      <div className="relative mb-6">
        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input 
          type="text" 
          placeholder="Search By name, subjects....."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <select className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none appearance-none cursor-pointer">
          <option>All Subjects</option>
        </select>
        <select className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none appearance-none cursor-pointer">
          <option>Any Style</option>
        </select>
        <select className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none appearance-none cursor-pointer">
          <option>Best Match</option>
        </select>
      </div>

      <p className="text-md text-gray-700 mb-6 font-medium">Showing 2 study buddies</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="border border-gray-300 rounded-3xl p-6 relative flex flex-col hover:shadow-lg transition-shadow bg-white">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-2xl font-playfair text-zinc-900 font-bold mb-1">Sofia Reyes</h3>
              <p className="text-gray-600 mb-1">Computer Science</p>
              <p className="text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                MIT · Year 3
              </p>
            </div>
            <div className="text-right">
              <span className="text-gray-400 font-medium tracking-wide">89%</span>
              <button className="block mt-1 text-gray-400 hover:text-red-500">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 mb-4">
            <span className="px-4 py-1.5 bg-[#FBE58D] text-sm text-black border border-[#d6a546] rounded-full">Top Rated</span>
            <span className="px-4 py-1.5 bg-[#fcf8e3] text-sm text-gray-600 border border-[#d6a546] rounded-full">Consistent</span>
            <span className="px-4 py-1.5 bg-white text-sm text-gray-600 border border-gray-300 rounded-full">3 Mutual</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-4 py-1 border border-gray-300 rounded-full text-xs text-gray-500">Algorithms</span>
            <span className="px-4 py-1 border border-gray-300 rounded-full text-xs text-gray-500">Data Structures</span>
            <span className="px-4 py-1 border border-gray-300 rounded-full text-xs text-gray-500">Python</span>
          </div>

          <div className="mt-auto flex justify-between items-center space-x-3">
             <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50">
               <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
             </button>
             <button className="flex-1 bg-[#1a1a1a] text-white py-2.5 rounded-full text-sm font-medium hover:bg-black flex justify-center items-center">
               <span className="mr-1">+</span> Show details
             </button>
             <button className="flex-1 bg-[#1a1a1a] text-white py-2.5 rounded-full text-sm font-medium hover:bg-black flex justify-center items-center">
               <span className="mr-1">+</span> Connect
             </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border border-gray-300 rounded-3xl p-6 relative flex flex-col hover:shadow-lg transition-shadow bg-white">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-2xl font-playfair text-zinc-900 font-bold mb-1">Marcus Chen</h3>
              <p className="text-gray-600 mb-1">Applied Mathematics</p>
              <p className="text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Stanford · Year 2
              </p>
            </div>
            <div className="text-right">
              <span className="text-gray-400 font-medium tracking-wide">89%</span>
              <button className="block mt-1 text-gray-400 hover:text-red-500">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 mb-4">
            <span className="px-4 py-1.5 bg-[#fcf8e3] text-sm text-gray-700 border border-[#d6a546] rounded-full">Math Wizard</span>
            <span className="px-4 py-1.5 bg-white text-sm text-gray-600 border border-gray-300 rounded-full">2 mutual</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-4 py-1 border border-gray-300 rounded-full text-xs text-gray-500">Linear Algebra</span>
            <span className="px-4 py-1 border border-gray-300 rounded-full text-xs text-gray-500">Calculus</span>
            <span className="px-4 py-1 border border-gray-300 rounded-full text-xs text-gray-500">Statistics</span>
          </div>

          <div className="mt-auto flex justify-between items-center space-x-3">
             <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50">
               <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
             </button>
             <button className="flex-1 bg-[#1a1a1a] text-white py-2.5 rounded-full text-sm font-medium hover:bg-black flex justify-center items-center">
               <span className="mr-1">+</span> Show details
             </button>
             <button className="flex-1 bg-[#1a1a1a] text-white py-2.5 rounded-full text-sm font-medium hover:bg-black flex justify-center items-center">
               <span className="mr-1">+</span> Connect
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const RequestsView = () => {
  return (
    <div className="max-w-4xl font-worksans">
      <h2 className="text-[44px] md:text-[56px] font-playfair font-extrabold italic text-zinc-900 leading-[1.1] mb-8">Requests</h2>

      <div className="space-y-4">
        {/* Request 1 */}
        <div className="border border-gray-300 rounded-xl p-5 flex items-start justify-between bg-white hover:border-gray-400 transition-colors">
          <div className="flex flex-col max-w-lg">
            <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-2">Marcus Chen sent a request</h3>
            <p className="text-gray-600">Marcus Chen wants to connect with you as a study partner for Linear Algebra and Calculus.</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500 text-sm mb-4">15 minutes ago</span>
            <div className="flex space-x-3">
              <button className="px-6 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors">Accept</button>
              <button className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">Decline</button>
            </div>
          </div>
        </div>

        {/* Request 2 */}
        <div className="border border-gray-300 rounded-xl p-5 flex items-start justify-between bg-white hover:border-gray-400 transition-colors">
          <div className="flex flex-col max-w-lg">
            <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-2">Priya Kumar sent a request</h3>
            <p className="text-gray-600">Priya Kumar invited you to a study session: "Quantum Mechanics Deep Dive" — Saturday, Mar 16 at 10:00 AM on Zoom.</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500 text-sm mb-4">1 hour ago</span>
            <div className="flex space-x-3">
              <button className="px-6 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors">Accept</button>
              <button className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">Decline</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConnectionsView = () => {
  const connections = [
    { name: 'Sofia Reyes' },
    { name: 'David Park' },
    { name: 'Manuel Haik' },
    { name: 'Rita Joe' },
  ];

  return (
    <div className="max-w-4xl font-worksans">
      <h2 className="text-[44px] md:text-[56px] font-playfair font-extrabold italic text-zinc-900 leading-[1.1] mb-8">My Connections</h2>

      <div className="space-y-0">
        {connections.map((conn, idx) => (
          <div key={idx} className={`flex items-center justify-between py-6 ${idx !== connections.length - 1 ? 'border-b border-gray-400' : 'border-b border-gray-400'}`}>
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-3xl border border-gray-400 flex items-center justify-center bg-gray-50">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-4xl font-playfair font-bold text-zinc-900">{conn.name}</h3>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-2 border border-black rounded-lg text-red-500 hover:bg-gray-50 transition-colors">
                remove
              </button>
              <button className="px-6 py-2 border border-black rounded-lg bg-[#FBE58D] text-black hover:bg-[#ebd371] transition-colors">
                details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
