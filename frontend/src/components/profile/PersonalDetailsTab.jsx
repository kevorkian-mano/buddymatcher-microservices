import React from 'react';
import { CoursesList } from './CoursesList';

export const PersonalDetailsTab = ({ user, profile }) => {
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">University</span>
            <div className="text-lg font-worksans font-medium text-zinc-900 bg-stone-100 px-4 py-3 rounded-xl border border-stone-200">
              {user?.university || 'Not specified'}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Major</span>
            <div className="text-lg font-worksans font-medium text-zinc-900 bg-stone-100 px-4 py-3 rounded-xl border border-stone-200">
              {user?.major || 'Not specified'}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Academic Year</span>
            <div className="text-lg font-worksans font-medium text-zinc-900 bg-stone-100 px-4 py-3 rounded-xl border border-stone-200">
              {user?.academicYear || 'Not specified'}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Contact Info</span>
            <div className="text-lg font-worksans font-medium text-zinc-900 bg-stone-100 px-4 py-3 rounded-xl border border-stone-200">
              {user?.contactInfo || 'Not specified'}
            </div>
          </div>
        </div>
      </div>
      <CoursesList courses={profile?.courses || []} />
    </div>
  );
};
