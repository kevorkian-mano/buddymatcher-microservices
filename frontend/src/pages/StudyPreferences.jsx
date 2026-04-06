import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import Header from '../components/layout/Header';
import { NavigationButtons } from '../components/profile/NavigationButtons';
import { LearningStyleCard } from '../components/profile/LearningStyleCard';
import { DayPill } from '../components/profile/DayPill';
import { StudyGoalCard } from '../components/profile/StudyGoalCard';

const UPDATE_PREFERENCES = gql`
  mutation UpdatePreferences($studyStyle: String, $studyPace: String, $studyMode: String, $groupSize: String) {
    updatePreferences(studyStyle: $studyStyle, studyPace: $studyPace, studyMode: $studyMode, groupSize: $groupSize) {
      id
    }
  }
`;

const ADD_AVAILABILITY_SLOT = gql`
  mutation AddAvailabilitySlot($dayOfWeek: Int!, $startTime: String!, $endTime: String!) {
    addAvailabilitySlot(dayOfWeek: $dayOfWeek, startTime: $startTime, endTime: $endTime) {
      id
    }
  }
`;

const ADD_FREE_DAY = gql`
  mutation AddFreeDay($dayOfWeek: Int!) {
    addFreeDay(dayOfWeek: $dayOfWeek) {
      id
    }
  }
`;

const ADD_STUDY_GOAL = gql`
  mutation AddStudyGoal($goal: String!) {
    addStudyGoal(goal: $goal) {
      id
    }
  }
`;

const learningStyles = [
  { id: 'visual', title: 'Visual Learner', description: 'Charts, diagrams & Videos' },
  { id: 'auditory', title: 'Auditory', description: 'Discussion & verbal explanation' },
  { id: 'reading', title: 'Reading/Writing', description: 'Notes, books & written material' },
  { id: 'handson', title: 'Hands-on', description: 'Practice problems & experiments' }
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const studyGoals = [
  'Exam Preperation', 'Homework Help', 'Group Projects',
  'Deep learning', 'Reaserch', 'Language Practice'
];

const dayMapping = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6
};

export default function StudyPreferences() {
  const navigate = useNavigate();
  const [selectedLearningStyle, setSelectedLearningStyle] = useState('');
  const [studyPace, setStudyPace] = useState('');
  const [studyMode, setStudyMode] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [bio, setBio] = useState('');

  const [updatePreferences] = useMutation(UPDATE_PREFERENCES);
  const [addFreeDay] = useMutation(ADD_FREE_DAY);
  const [addStudyGoal] = useMutation(ADD_STUDY_GOAL);

  const handleDayToggle = (day) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleGoalToggle = (goal) => {
    setSelectedGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]);
  };

  const handleBackClick = () => navigate(-1);
  const handleRegister = async () => {
    try {
      // Save learning style, pace, mode, and group size
      await updatePreferences({ 
        variables: { 
          studyStyle: selectedLearningStyle,
          studyPace: studyPace,
          studyMode: studyMode,
          groupSize: groupSize
        } 
      });

      // Save days of availability (Mocking using free days properly)
      for (const day of selectedDays) {
        const dayInt = dayMapping[day];
        if (dayInt !== undefined) {
          await addFreeDay({ variables: { dayOfWeek: dayInt } });
        }
      }

      // Save additional goals accurately
      for (const goal of selectedGoals) {
        await addStudyGoal({ variables: { goal } });
      }

      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      navigate('/dashboard');
    }
  };

  const canContinue = selectedLearningStyle !== '' && selectedDays.length > 0 && selectedGoals.length > 0 && studyPace !== '' && studyMode !== '' && groupSize !== '';

  return (
    <main className="overflow-hidden px-10 md:px-20 pt-10 md:pt-14 pb-20 md:pb-28 bg-white min-h-screen">
      <div className="flex flex-col w-full max-w-[1000px] mx-auto relative">
        <Header showProgress={true} progress={85} />

        <header className="mb-12 mt-6">
          <h1 className="text-5xl md:text-6xl font-playfair italic font-extrabold text-zinc-900 mb-4 leading-tight">
            Study Preferences
          </h1>
          <p className="text-xl font-worksans text-zinc-800">
            Help us match you with the most compatible study buddies.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-playfair font-bold text-zinc-900">
            What&apos;s Your learning style?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {learningStyles.map((style) => (
              <LearningStyleCard
                key={style.id}
                title={style.title}
                description={style.description}
                isSelected={selectedLearningStyle === style.id}
                onClick={() => setSelectedLearningStyle(style.id)}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-playfair font-bold text-zinc-900">
            What is your preferred study pace?
          </h2>
          <div className="flex flex-wrap gap-3">
            {['Slow', 'Moderate', 'Fast'].map((pace) => (
              <DayPill
                key={pace}
                day={pace}
                isSelected={studyPace === pace}
                onClick={() => setStudyPace(pace)}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-playfair font-bold text-zinc-900">
            How do you prefer to study? (Mode)
          </h2>
          <div className="flex flex-wrap gap-3">
            {['Online', 'In-person', 'Both'].map((mode) => (
              <DayPill
                key={mode}
                day={mode}
                isSelected={studyMode === mode}
                onClick={() => setStudyMode(mode)}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-playfair font-bold text-zinc-900">
            Preferred group size?
          </h2>
          <div className="flex flex-wrap gap-3">
            {['Small Group', 'Large Group'].map((size) => (
              <DayPill
                key={size}
                day={size}
                isSelected={groupSize === size}
                onClick={() => setGroupSize(size)}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <header className="flex gap-2 items-end mb-6">
            <h2 className="text-2xl font-playfair font-bold text-zinc-900">
              Days you are free
            </h2>
            <p className="text-lg font-worksans text-zinc-600 pb-[2px]">
              (select all that apply)
            </p>
          </header>
          <div className="flex flex-wrap gap-3">
            {daysOfWeek.map((day) => (
              <DayPill
                key={day}
                day={day}
                isSelected={selectedDays.includes(day)}
                onClick={() => handleDayToggle(day)}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-playfair font-bold text-zinc-900">
            What are your main study goals?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {studyGoals.map((goal) => (
              <StudyGoalCard
                key={goal}
                title={goal}
                isSelected={selectedGoals.includes(goal)}
                onClick={() => handleGoalToggle(goal)}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <header className="flex gap-2 items-end mb-1.5">
            <label htmlFor="bio" className="text-base font-worksans font-medium text-zinc-800 block">
              Short bio
            </label>
            <span className="text-sm font-worksans text-zinc-500 pb-[1px]">(optional)</span>
          </header>
          <textarea
            id="bio"
            placeholder="Tell potential study buddies a bit about yourself and how you like to study...."
            className="w-full px-4 py-3.5 text-base font-worksans text-zinc-800 rounded-xl border border-zinc-400 resize-none bg-white min-h-[140px] focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 transition-colors"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </section>

        {/* Decorative Sparkles and Shapes */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f67e14264a980a3c5b9ee5af02f650f5baa3ac3a?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
              alt="Decorative illustration"
              className="object-contain absolute z-20 shrink-0 aspect-[0.87] -bottom-8 right-0 md:-right-8 h-[2456px] w-[100px]"
            />
            {/* Bottom-right sparkle */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f67e14264a980a3c5b9ee5af02f650f5baa3ac3a?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
              alt="Decorative illustration"
              className="object-contain absolute z-20 shrink-0 aspect-[0.87] -bottom-8 right-0 md:-right-8 h-[2506px] w-[200px]"
            />

        <NavigationButtons
          onBack={handleBackClick}
          onContinue={handleRegister}
          canContinue={canContinue}
        />
      </div>
    </main>
  );
}
