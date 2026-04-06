import React from 'react';

export const SubjectSelector = ({
  selectedSubjects,
  onSubjectsChange
}) => {
  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History',
    'Computer science', 'Literature', 'Economics', 'Engineering',
    'Law', 'Psychology', 'Philosophy', 'Statistics', 'Medicine', 'Business'
  ];

  const toggleSubject = (subject) => {
    const isSelected = selectedSubjects.includes(subject);
    if (isSelected) {
      onSubjectsChange(selectedSubjects.filter(s => s !== subject));
    } else {
      onSubjectsChange([...selectedSubjects, subject]);
    }
  };

  const getSubjectButtonClass = (subject) => {
    const isSelected = selectedSubjects.includes(subject);
    const baseClass = "px-6 py-3 border border-solid border-stone-700 rounded-full transition-colors cursor-pointer hover:bg-gray-50 flex items-center justify-center whitespace-nowrap font-worksans text-lg";
    return isSelected ? `${baseClass} bg-[#efd476]` : baseClass;
  };

  return (
    <section className="flex flex-col mt-10 max-w-full text-zinc-800">
      <header className="flex gap-2 items-end mb-6">
        <h2 className="text-3xl font-playfair font-bold">
          Subjects you Study
        </h2>
        <p className="text-xl font-worksans pb-1 opacity-80">
          (select all that apply)
        </p>
      </header>

      <div className="flex flex-wrap gap-4 mt-2 max-w-4xl">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => toggleSubject(subject)}
            className={getSubjectButtonClass(subject)}
            type="button"
          >
            <span>{subject}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
