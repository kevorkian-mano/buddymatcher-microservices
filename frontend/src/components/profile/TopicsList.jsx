import React from 'react';

export const TopicsList = ({ topics = [] }) => {
  if (!topics || topics.length === 0) return null;

  return (
    <section className="w-full mt-4 mb-8">
      <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-4">
        Subjects / Topics
      </h3>
      <div className="flex flex-wrap gap-3 items-center text-lg font-worksans font-medium text-zinc-800">
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-center px-6 py-3 rounded-xl border border-stone-300 bg-stone-50 hover:border-black transition-colors"
          >
            {topic.name}
          </div>
        ))}
      </div>
    </section>
  );
};
