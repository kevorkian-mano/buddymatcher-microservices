import React from 'react';

export const CoursesList = ({ courses = [] }) => {
  if (!courses || courses.length === 0) return null;

  return (
    <section className="w-full mt-8 mb-4">
      <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-4">
        Courses
      </h3>
      <div className="flex flex-wrap gap-3 items-center text-lg font-worksans font-medium text-zinc-800">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-6 py-4 rounded-xl border-2 border-black bg-[#efd476] shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform"
          >
            {course.code && <span className="font-bold">{course.code}:</span>}
            <span>{course.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
