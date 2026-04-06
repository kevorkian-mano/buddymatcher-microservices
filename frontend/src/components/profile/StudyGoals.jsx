import React from 'react';

export const StudyGoals = ({ studyGoals = [] }) => {
  if (!studyGoals || studyGoals.length === 0) return null;

  return (
    <section className="w-full mt-4 mb-4">
      <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-4">
        Study Goals
      </h3>
      <div className="flex flex-wrap gap-3 items-center text-lg font-worksans font-medium text-zinc-800">
        {studyGoals.map((goal, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-center px-6 py-4 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform cursor-default"
          >
            {goal.goal}
          </div>
        ))}
      </div>
    </section>
  );
};
