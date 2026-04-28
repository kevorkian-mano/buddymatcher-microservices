import React, { useState } from 'react';

// Simple CourseSelector: displays a searchable list of course rows with code + name and allows multi-select.
// Keeps visual parity with existing SubjectSelector (pills) but shows code prefix when present.
// Props:
// - selectedCourses: array of { code?, name }
// - onChange: function(updatedArray)
// - available: optional array of { code?, name } to seed suggestions

export const CourseSelector = ({ selectedCourses = [], onChange, available = [] }) => {
  const [query, setQuery] = useState('');

  const seeded = available.length > 0 ? available : [
    { code: 'CS101', name: 'Introduction to Computer Science' },
    { code: 'MATH201', name: 'Calculus II' },
    { code: 'PHYS110', name: 'General Physics I' },
    { code: 'CHEM101', name: 'General Chemistry' },
    { code: 'ECON101', name: 'Microeconomics' },
    { code: 'STAT200', name: 'Statistics' },
    { code: 'BIO150', name: 'Biology Basics' },
  ];

  const normalizedSeed = seeded.map(s => ({ code: s.code || '', name: s.name }));

  const filtered = normalizedSeed.filter(c => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${c.code} ${c.name}`.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
  });

  const isSelected = (course) => selectedCourses.some(sc => (sc.code || '').toLowerCase() === (course.code || '').toLowerCase() && sc.name.toLowerCase() === course.name.toLowerCase());

  const toggle = (course) => {
    const selected = isSelected(course);
    if (selected) {
      onChange(selectedCourses.filter(sc => !(sc.name === course.name && (sc.code || '') === (course.code || ''))));
    } else {
      onChange([...selectedCourses, course]);
    }
  };

  return (
    <section className="flex flex-col mt-10 max-w-full text-zinc-800">
      <header className="flex gap-2 items-end mb-4">
        <h2 className="text-3xl font-playfair font-bold">Courses you currently take</h2>
        <p className="text-xl font-worksans pb-1 opacity-80">(select all that apply)</p>
      </header>

      <div className="flex items-center gap-3 mb-4 max-w-3xl">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search or type to filter courses (e.g. CS101)"
          className="flex-1 px-4 py-3 rounded-xl border border-stone-300 font-worksans focus:outline-none focus:ring-1 focus:ring-zinc-800"
        />
      </div>

      <div className="flex flex-wrap gap-3 mt-2">
        {filtered.map((c, idx) => {
          const sel = isSelected(c);
          return (
            <button
              key={`${c.code}-${idx}`}
              onClick={() => toggle(c)}
              type="button"
              className={`px-6 py-3 border border-solid border-stone-700 rounded-full transition-colors cursor-pointer hover:bg-gray-50 flex items-center justify-center whitespace-nowrap font-worksans text-lg ${sel ? 'bg-[#efd476]' : ''}`}
            >
              <span>{c.code ? `${c.code}: ` : ''}{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* show selected courses as pills for clarity */}
      {selectedCourses && selectedCourses.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {selectedCourses.map((c, i) => (
            <div key={`${c.code}-${i}`} className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg bg-stone-50 font-worksans">
              <span>{c.code ? `${c.code}: ` : ''}{c.name}</span>
              <button onClick={() => onChange(selectedCourses.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 ml-1 font-bold">×</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
