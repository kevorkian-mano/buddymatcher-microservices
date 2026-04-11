import React, { useState, useEffect } from 'react';
import { Header, Breadcrumb, Sidebar } from '../components/dashboard';

const Messages = () => {
  const [user, setUser] = useState({ name: "Alex" });
  const [activeChat, setActiveChat] = useState(1);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const chats = [
    {
      id: 1,
      name: "Sofia Reyes",
      lastMessage: "Sounds good, see you then!",
      time: "2m",
      unread: 0,
      avatar: "S"
    },
    {
      id: 2,
      name: "Algorithms Study Group",
      lastMessage: "Has anyone started on problem 3?",
      time: "1h",
      unread: 3,
      avatar: "A"
    },
    {
      id: 3,
      name: "Marcus Chen",
      lastMessage: "Thanks for the help with Linear Algebra.",
      time: "Yesterday",
      unread: 0,
      avatar: "M"
    }
  ];

  const activeMessages = [
    { id: 1, sender: "Sofia Reyes", text: "Hey! Are we still on for our study session today?", time: "10:00 AM", isMe: false },
    { id: 2, sender: "Me", text: "Yes! Library Room 204 right?", time: "10:05 AM", isMe: true },
    { id: 3, sender: "Sofia Reyes", text: "Yep, see you at 3 PM. I'll bring the practice tests.", time: "10:10 AM", isMe: false },
    { id: 4, sender: "Me", text: "Sounds good, see you then!", time: "10:15 AM", isMe: true }
  ];

  return (
    <div className="overflow-hidden pr-6 md:pr-8 lg:pr-12 pl-0 pt-4 md:pt-6 pb-20 md:pb-28 bg-white min-h-screen relative">
      <div className="max-w-[1800px] mx-auto z-10 relative flex flex-col w-full h-full">
        {/* Header section */}
        <div className="w-full flex flex-col mb-10 pl-6 md:pl-8 lg:pl-12">
          <Header userName={user.name} />
          <div className="mt-4"><Breadcrumb /></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
          {/* Sidebar */}
          <div className="hidden lg:block w-[300px] shrink-0 sticky top-6">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 w-full min-w-0 px-4 md:px-8">
            <main className="flex-1 font-worksans max-w-6xl w-full h-[75vh] flex flex-col">
              
              <div className="mb-6">
                <h2 className="text-[44px] md:text-[56px] font-playfair font-extrabold italic text-zinc-900 leading-[1.1] tracking-tight">
                  Messages
                </h2>
              </div>

              {/* Chat App Container */}
              <div className="flex flex-1 border border-gray-300 rounded-[2.5rem] overflow-hidden bg-white shadow-sm min-h-0">
                
                {/* Chat List Sidebar */}
                <div className="w-1/3 border-r border-gray-300 flex flex-col bg-gray-50/30">
                  <div className="p-6 border-b border-gray-200">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search messages..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400 text-[15px]"
                      />
                      <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                  </div>
                  <div className="overflow-y-auto flex-1 p-3">
                    {chats.map(chat => (
                      <div 
                        key={chat.id}
                        onClick={() => setActiveChat(chat.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-colors mb-2 ${activeChat === chat.id ? 'bg-[#FBE58D]/30 border border-[#FBE58D]/60' : 'hover:bg-gray-100 border border-transparent'}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#efd476] flex items-center justify-center text-xl font-playfair font-bold text-gray-800 shrink-0">
                          {chat.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-gray-900 truncate pr-2">{chat.name}</h4>
                            <span className="text-xs text-gray-500 shrink-0">{chat.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        </div>
                        {chat.unread > 0 && (
                          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {chat.unread}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                  {/* Chat Header */}
                  <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#efd476] flex items-center justify-center text-xl font-playfair font-bold text-gray-800">
                        S
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">Sofia Reyes</h3>
                        <p className="text-sm text-gray-500">Active now</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                    </button>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/10">
                    {activeMessages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-6 py-3.5 ${msg.isMe ? 'bg-black text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-sm'}`}>
                          <p className="text-[16px] leading-relaxed">{msg.text}</p>
                        </div>
                        <span className="text-xs text-gray-400 mt-2 mx-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-6 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-4">
                      <button className="text-gray-400 hover:text-gray-600 p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                      </button>
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="flex-1 bg-gray-100 border-none px-6 py-3.5 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 text-[16px]"
                      />
                      <button className="bg-[#2d2d2d] text-white p-3.5 rounded-full hover:bg-black transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
