import React from 'react';

export const StudyGoals = ({ topics = [] }) => {
  // If no topics mapped via backend, render defaults for visual consistency
  const goals = topics.length > 0 
    ? topics.map(t => t.name) 
    : ['Homework Help', 'Group Projects', 'Deep learning'];

  return (
    <section className="w-full mt-10 mb-20">
      <h3 className="text-3xl font-playfair font-bold text-zinc-900 mb-6">
        Study goals & Topics:
      </h3>
      <div className="flex flex-wrap gap-4 items-center text-xl md:text-2xl font-worksans font-medium text-zinc-800">
        {goals.map((goal, idx) => (
          <div
            key={idx}
            className="w-full md:w-auto flex flex-col justify-center px-10 py-8 rounded-[24px] border-2 border-black bg-white shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform cursor-default"
          >
            {goal}
          </div>
        ))}
      </div>
    </section>
  );
};