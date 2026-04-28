import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import Header from '../components/layout/Header';
import { FormFields } from '../components/profile/FormFields';
import { CourseSelector } from '../components/profile/CourseSelector';
import { TopicsList } from '../components/profile/TopicsList';
import { NavigationButtons } from '../components/profile/NavigationButtons';
import { motion } from 'framer-motion';

const UPDATE_USER_PROFILE = gql`
  mutation UpdateProfile($university: String, $major: String, $academicYear: String) {
    updateProfile(university: $university, major: $major, academicYear: $academicYear) {
      id
    }
  }
`;

const ADD_TOPIC = gql`
  mutation AddTopic($name: String!) {
    addTopic(name: $name) {
      id
    }
  }
`;

const UPSERT_PROFILE = gql`
  mutation UpsertProfile($userId: ID!) {
    upsertProfile(userId: $userId) {
      id
    }
  }
`;

export default function AcademicProfile() {
  const navigate = useNavigate();
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [topicsText, setTopicsText] = useState('');
  
  const [updateProfile] = useMutation(UPDATE_USER_PROFILE);
  const [addTopic] = useMutation(ADD_TOPIC);
  const [addCourse] = useMutation(gql`mutation AddCourse($name: String!, $code: String) { addCourse(name: $name, code: $code) { id } }`);
  const [upsertProfile] = useMutation(UPSERT_PROFILE);

  const handleBack = () => navigate(-1);
  const handleContinue = async () => {
    try {
      // 0. Ensure user profile initialized
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        await upsertProfile({ variables: { userId: u.id } });
      }

      // 1. Update university, major, and year in User service
      await updateProfile({ variables: { university, major, academicYear: year } });

      // 2. Add selected courses and topics to Profile service
      // Persist courses (name + code). selectedSubjects is expected to be array of { name, code }
      for (const c of selectedSubjects) {
        // If item is a string (older flow), treat it as name-only
        if (typeof c === 'string') {
          await addCourse({ variables: { name: c } }).catch(console.error);
        } else {
          await addCourse({ variables: { name: c.name, code: c.code } }).catch(console.error);
        }
      }

      // Persist topics from textarea: split by newlines or commas
      const raw = topicsText || '';
      const parsed = raw.split(/\n|,/).map(s => s.trim()).filter(Boolean);
      for (const t of parsed) {
        await addTopic({ variables: { name: t } }).catch(console.error);
      }
      
      navigate('/study-preferences');
    } catch (e) {
      console.error(e);
      // fallback in case subgraphs fail
      navigate('/study-preferences');
    }
  };

  const canContinue = university.trim() !== '' && major.trim() !== '' && year !== '' && selectedSubjects.length > 0;

  return (
    <motion.main 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="overflow-hidden px-20 pt-14 pb-28 bg-white max-md:pb-24 max-md:pl-5 min-h-screen"
    >
      <div className="flex flex-col w-full max-md:max-w-full">
        <div className="flex relative items-center w-full max-md:max-w-full">
          <div className="flex z-0 flex-col self-stretch my-auto min-w-60 w-[1335px] max-md:max-w-full">
            <Header showProgress={true} progress={63} />

            <section className="mt-3.5 max-w-full w-[1292px]">
              <h1 className="text-6xl italic font-extrabold text-zinc-800 max-md:max-w-full max-md:text-4xl font-playfair">
                Your academic profile
              </h1>
              <p className="mt-6 text-xl text-zinc-800 max-md:max-w-full font-worksans">
                Help us Find the most compatible study Partner for you.
              </p>
            </section>

            <FormFields
              university={university}
              major={major}
              year={year}
              onUniversityChange={setUniversity}
              onMajorChange={setMajor}
              onYearChange={setYear}
            />

            <CourseSelector
              selectedCourses={selectedSubjects}
              onChange={setSelectedSubjects}
            />

            <section className="mt-8 max-w-full">
              <label className="text-2xl font-playfair font-bold">Topics</label>
              <p className="text-md font-worksans opacity-80 mb-3">Add topics you're interested in (comma or newline separated)</p>
              <textarea
                value={topicsText}
                onChange={e => setTopicsText(e.target.value)}
                placeholder="e.g. linear algebra, machine learning, operating systems"
                className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-stone-300 font-worksans focus:outline-none focus:ring-1 focus:ring-zinc-800"
              />

              <TopicsList topics={(topicsText || '').split(/\n|,/).map(s => ({ name: s.trim() })).filter(t => t.name)} />
            </section>
          </div>

        {/* Decorative Sparkles and Shapes */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f67e14264a980a3c5b9ee5af02f650f5baa3ac3a?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
              alt="Decorative illustration"
              className="object-contain absolute z-20 shrink-0 aspect-[0.87] -bottom-8 right-0 md:-right-8 h-[1370px] w-[100px]"
            />
            {/* Bottom-right sparkle */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f67e14264a980a3c5b9ee5af02f650f5baa3ac3a?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
              alt="Decorative illustration"
              className="object-contain absolute z-20 shrink-0 aspect-[0.87] -bottom-8 right-0 md:-right-8 h-[1400px] w-[200px]"
            />
        </div>

        <NavigationButtons
          onBack={handleBack}
          onContinue={handleContinue}
          canContinue={canContinue}
        />
      </div>
    </motion.main>
  );
}
