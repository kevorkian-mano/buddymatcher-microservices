import React, { useState } from 'react';

export const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState('study preferences');

  const tabs = [
    { id: 'study preferences', label: 'Study Preferences' },
    { id: 'personal details', label: 'Personal Details' },
    { id: 'recent activity', label: 'Recent Activity' }
  ];

  return (
    <nav className="flex flex-wrap gap-4 mt-6 w-full text-lg font-worksans font-medium text-zinc-800 border-b border-zinc-200 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center px-6 py-3 rounded-xl border-2 transition-all ${
            activeTab === tab.id
              ? 'bg-[#efd476] border-black font-bold shadow-[4px_4px_0px_#000] translate-y-[-2px]'
              : 'bg-white border-transparent hover:bg-stone-100 hover:border-stone-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};