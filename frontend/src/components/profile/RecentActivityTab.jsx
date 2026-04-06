import React from 'react';

export const RecentActivityTab = () => {
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-4">Recent Activity</h3>
        <p className="text-lg font-worksans font-medium text-zinc-700">
          No recent activity to show yet. Check back later!
        </p>
      </div>
    </div>
  );
};
