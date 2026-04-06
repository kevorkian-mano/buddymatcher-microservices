import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/7ef07c462edb8cf430c5967ec06dcc5629211215?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865",
      label: "Dashboard",
      path: "/dashboard"
    },
    {
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/75e5b7945a04d208fafe6eca3752e1c1723f7ba7?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865",
      label: "Matching",
      path: "/matching"
    },
    {
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/a460c5dc5090d45e16dd6c8fcb69177c790a6479?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865",
      label: "Sessions",
      path: "/sessions"
    },
    {
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/3a3ea70980a27a62d4a822cc71fc5d9e33e1424b?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865",
      label: "Messages",
      path: "/messages"
    },
    {
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/49a75d5719d11ba8a7bfd80acbd24df01d47e883?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865",
      label: "My profile",
      path: "/profile"
    }
  ];

  return (
    <aside className="text-xl rounded-none min-w-60 text-zinc-800 w-[300px] shrink-0 transition-all font-worksans font-medium z-20 sticky top-10">
      <nav className="flex flex-col items-start px-8 pt-10 pb-40 w-full bg-[#efd476] border border-black border-solid rounded-[32px] max-md:px-5 max-md:pb-24 shadow-md">
        {menuItems.map((item, index) => {
          const isActive = currentPath === item.path || (item.path === '/dashboard' && currentPath === '/');
          
          return (
            <div key={item.label} className="w-full">
              <Link 
                to={item.path} 
                className={`flex gap-6 whitespace-nowrap items-center w-full px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-amber-100 font-bold' : 'hover:bg-amber-100/50'
                }`}
              >
                <img
                  src={item.icon}
                  className="object-contain shrink-0 aspect-square w-[23px]"
                  alt={`${item.label} icon`}
                />
                <span className="text-zinc-800">{item.label}</span>
              </Link>
              
              {/* Render optional separators based on the original snippet */}
              {index < menuItems.length - 1 && (
                <div className="w-full h-px bg-zinc-900/10 my-4" />
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};