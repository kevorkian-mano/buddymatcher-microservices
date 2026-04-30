import React from 'react';
import { LearningStyle } from './LearningStyle';
import { StudyGoals } from './StudyGoals';
import { TopicsList } from './TopicsList';


export const StudyPreferencesTab = ({ profile }) => {
  const preferences = profile?.preferences || {};
  
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="bg-white p-6 border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
        <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-4">Study Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Study Pace</span>
            <div className="text-lg font-worksans font-medium text-zinc-900 bg-stone-100 px-4 py-3 rounded-xl border border-stone-200">
              {preferences.studyPace || 'Not specified'}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Study Mode</span>
            <div className="text-lg font-worksans font-medium text-zinc-900 bg-stone-100 px-4 py-3 rounded-xl border border-stone-200">
              {preferences.studyMode || 'Not specified'}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Group Size</span>
            <div className="text-lg font-worksans font-medium text-zinc-900 bg-stone-100 px-4 py-3 rounded-xl border border-stone-200">
              {preferences.groupSize || 'Not specified'}
            </div>
          </div>
        </div>
      </div>
      
      <LearningStyle studyStyle={preferences.studyStyle} />
      <StudyGoals studyGoals={profile?.studyGoals || []} />
      <TopicsList topics={profile?.topics || []} />

    </div>
  );
};
