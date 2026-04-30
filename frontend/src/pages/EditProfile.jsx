import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { GET_MY_FULL_PROFILE } from '../graphql/queries/profileQueries';
import { UPDATE_USER_PROFILE } from '../graphql/mutations/userMutations';
import { Header, Breadcrumb, Sidebar } from '../components/dashboard';
import { DayPill } from '../components/profile/DayPill';
import { LearningStyleCard } from '../components/profile/LearningStyleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UPDATE_PREFERENCES = gql`
  mutation UpdatePreferences($studyStyle: String, $studyPace: String, $studyMode: String, $groupSize: String) {
    updatePreferences(studyStyle: $studyStyle, studyPace: $studyPace, studyMode: $studyMode, groupSize: $groupSize) {
      id
    }
  }
`;

const ADD_TOPIC = gql`mutation AddTopic($name: String!) { addTopic(name: $name) { id } }`;
const REMOVE_TOPIC = gql`mutation RemoveTopic($topicId: ID!) { removeTopic(topicId: $topicId) }`;

const ADD_STUDY_GOAL = gql`mutation AddStudyGoal($goal: String!) { addStudyGoal(goal: $goal) { id } }`;
const REMOVE_STUDY_GOAL = gql`mutation RemoveStudyGoal($goalId: ID!) { removeStudyGoal(goalId: $goalId) }`;

const ADD_COURSE = gql`mutation AddCourse($name: String!, $code: String) { addCourse(name: $name, code: $code) { id } }`;
const REMOVE_COURSE = gql`mutation RemoveCourse($courseId: ID!) { removeCourse(courseId: $courseId) }`;

const learningStyles = [
  { id: 'visual', title: 'Visual Learner', description: 'Charts, diagrams & Videos' },
  { id: 'auditory', title: 'Auditory', description: 'Discussion & verbal explanation' },
  { id: 'reading', title: 'Reading/Writing', description: 'Notes, books & written material' },
  { id: 'handson', title: 'Hands-on', description: 'Practice problems & experiments' }
];

function EditProfile() {
  const navigate = useNavigate();

  const { data, loading } = useQuery(GET_MY_FULL_PROFILE, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  });

  const [updateProfile] = useMutation(UPDATE_USER_PROFILE);
  const [updatePreferences] = useMutation(UPDATE_PREFERENCES);

  const [addTopic] = useMutation(ADD_TOPIC);
  const [removeTopic] = useMutation(REMOVE_TOPIC);
  const [addGoal] = useMutation(ADD_STUDY_GOAL);
  const [removeGoal] = useMutation(REMOVE_STUDY_GOAL);
  const [addCourse] = useMutation(ADD_COURSE);
  const [removeCourse] = useMutation(REMOVE_COURSE);

  // General States
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  
  const [studyPace, setStudyPace] = useState('');
  const [studyMode, setStudyMode] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [studyStyle, setStudyStyle] = useState('');

  // Lists States
  const [topics, setTopics] = useState([]);
  const [removedTopics, setRemovedTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');

  const [goals, setGoals] = useState([]);
  const [removedGoals, setRemovedGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

  const [courses, setCourses] = useState([]);
  const [removedCourses, setRemovedCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setUniversity(data.me?.university || '');
      setMajor(data.me?.major || '');
      setAcademicYear(data.me?.academicYear || '');
      setContactInfo(data.me?.contactInfo || '');

      const prefs = data.getMyProfile?.preferences || {};
      setStudyPace(prefs.studyPace || '');
      setStudyMode(prefs.studyMode || '');
      setGroupSize(prefs.groupSize || '');
      setStudyStyle(prefs.studyStyle || '');

      setTopics(data.getMyProfile?.topics || []);
      setGoals(data.getMyProfile?.studyGoals || []);
      setCourses(data.getMyProfile?.courses || []);
    }
  }, [data]);

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    setTopics(prev => [...prev, { _isNew: true, name: newTopic.trim() }]);
    setNewTopic('');
  };
  const handleRemoveTopic = (t) => {
    if (t.id) setRemovedTopics(prev => [...prev, t.id]);
    setTopics(prev => prev.filter(item => item !== t));
  };

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    setGoals(prev => [...prev, { _isNew: true, goal: newGoal.trim() }]);
    setNewGoal('');
  };
  const handleRemoveGoal = (g) => {
    if (g.id) setRemovedGoals(prev => [...prev, g.id]);
    setGoals(prev => prev.filter(item => item !== g));
  };

  const handleAddCourse = () => {
    if (!newCourseName.trim()) return;
    setCourses(prev => [...prev, { _isNew: true, name: newCourseName.trim(), code: newCourseCode.trim() }]);
    setNewCourseName('');
    setNewCourseCode('');
  };
  const handleRemoveCourse = (c) => {
    if (c.id) setRemovedCourses(prev => [...prev, c.id]);
    setCourses(prev => prev.filter(item => item !== c));
  };

  if (loading) return <LoadingSpinner />;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ variables: { university, major, academicYear, contactInfo } });
      await updatePreferences({ variables: { studyStyle, studyPace, studyMode, groupSize } });

      for (const id of removedTopics) await removeTopic({ variables: { topicId: id } }).catch(console.error);
      for (const t of topics.filter(t => t._isNew)) await addTopic({ variables: { name: t.name } }).catch(console.error);

      for (const id of removedGoals) await removeGoal({ variables: { goalId: id } }).catch(console.error);
      for (const g of goals.filter(g => g._isNew)) await addGoal({ variables: { goal: g.goal } }).catch(console.error);

      for (const id of removedCourses) await removeCourse({ variables: { courseId: id } }).catch(console.error);
      for (const c of courses.filter(c => c._isNew)) await addCourse({ variables: { name: c.name, code: c.code } }).catch(console.error);

      navigate('/profile');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overflow-hidden pr-6 md:pr-8 lg:pr-12 pl-0 pt-4 md:pt-6 pb-20 md:pb-28 bg-white min-h-screen relative w-full">

      <div className="w-full max-w-none mx-0 z-10 relative flex flex-col h-full">
        <div className="w-full flex flex-col mb-10 pl-6 md:pl-8 lg:pl-12">
          <Header userName={data?.me?.name || "User"} />
          <Breadcrumb currentPath="Edit Profile" />
        </div>

        <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
          <div className="hidden lg:block w-[300px] shrink-0 sticky top-4">
            <Sidebar />
          </div>

          <div className="flex flex-col flex-1 w-full min-w-0 pr-4">
             <main className="flex flex-col w-full max-w-[900px] bg-white p-6 md:p-10 border-2 border-black rounded-3xl shadow-[4px_4px_0px_#000] mb-8">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-200">
                  <h1 className="text-3xl md:text-4xl font-playfair font-extrabold text-zinc-900 leading-tight">
                    Edit Your Profile
                  </h1>
                </div>

                <div className="flex flex-col gap-10">
                  {/* Personal & Academic Details */}
                  <section>
                    <h2 className="text-2xl font-playfair font-bold text-zinc-900 mb-6">Personal & Academic Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <label className="text-lg font-worksans text-zinc-800 mb-2">University</label>
                        <input className="px-4 py-3 rounded-xl border border-stone-300 font-worksans focus:outline-none focus:ring-1 focus:ring-zinc-800" value={university} onChange={e => setUniversity(e.target.value)} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-lg font-worksans text-zinc-800 mb-2">Major</label>
                        <input className="px-4 py-3 rounded-xl border border-stone-300 font-worksans focus:outline-none focus:ring-1 focus:ring-zinc-800" value={major} onChange={e => setMajor(e.target.value)} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-lg font-worksans text-zinc-800 mb-2">Academic Year</label>
                        <input className="px-4 py-3 rounded-xl border border-stone-300 font-worksans focus:outline-none focus:ring-1 focus:ring-zinc-800" value={academicYear} onChange={e => setAcademicYear(e.target.value)} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-lg font-worksans text-zinc-800 mb-2">Contact Info</label>
                        <input className="px-4 py-3 rounded-xl border border-stone-300 font-worksans focus:outline-none focus:ring-1 focus:ring-zinc-800" value={contactInfo} onChange={e => setContactInfo(e.target.value)} />
                      </div>
                    </div>
                  </section>

                  {/* Dynamic Lists (Courses, Topics, Goals) */}
                  <section>
                    <h2 className="text-2xl font-playfair font-bold text-zinc-900 mb-6">Courses & Subjects</h2>
                    
                    {/* Courses */}
                    <div className="mb-8">
                      <h3 className="text-lg font-worksans font-medium text-zinc-800 mb-3">Your Courses</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {courses.map((c, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg bg-stone-50 font-worksans">
                            <span>{c.code ? `${c.code}: ` : ''}{c.name}</span>
                            <button onClick={() => handleRemoveCourse(c)} className="text-red-500 hover:text-red-700 ml-1 font-bold">×</button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <input placeholder="Code (e.g. CS101)" className="w-1/3 px-4 py-2 rounded-xl border border-stone-300 font-worksans focus:ring-1 focus:ring-zinc-800" value={newCourseCode} onChange={e => setNewCourseCode(e.target.value)} />
                        <input placeholder="Course Name" className="w-2/3 px-4 py-2 rounded-xl border border-stone-300 font-worksans focus:ring-1 focus:ring-zinc-800" value={newCourseName} onChange={e => setNewCourseName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddCourse()} />
                        <button onClick={handleAddCourse} className="px-4 py-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 shrink-0">Add</button>
                      </div>
                    </div>

                    {/* Subjects (Topics) */}
                    <div className="mb-8">
                      <h3 className="text-lg font-worksans font-medium text-zinc-800 mb-3">Subjects / Topics</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {topics.map((t, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg bg-stone-50 font-worksans">
                            <span>{t.name}</span>
                            <button onClick={() => handleRemoveTopic(t)} className="text-red-500 hover:text-red-700 ml-1 font-bold">×</button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <input placeholder="Add a new subject..." className="flex-1 px-4 py-2 rounded-xl border border-stone-300 font-worksans focus:ring-1 focus:ring-zinc-800" value={newTopic} onChange={e => setNewTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTopic()} />
                        <button onClick={handleAddTopic} className="px-4 py-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 shrink-0">Add</button>
                      </div>
                    </div>

                    {/* Study Goals */}
                    <div>
                      <h3 className="text-lg font-worksans font-medium text-zinc-800 mb-3">Study Goals</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {goals.map((g, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg bg-stone-50 font-worksans">
                            <span>{g.goal}</span>
                            <button onClick={() => handleRemoveGoal(g)} className="text-red-500 hover:text-red-700 ml-1 font-bold">×</button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <input placeholder="Add a study goal..." className="flex-1 px-4 py-2 rounded-xl border border-stone-300 font-worksans focus:ring-1 focus:ring-zinc-800" value={newGoal} onChange={e => setNewGoal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddGoal()} />
                        <button onClick={handleAddGoal} className="px-4 py-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 shrink-0">Add</button>
                      </div>
                    </div>
                  </section>

                  {/* Study Preferences */}
                  <section>
                    <h2 className="text-2xl font-playfair font-bold text-zinc-900 mb-6">Study Preferences</h2>
                    
                    <div className="flex flex-col gap-8">
                      <div>
                        <h3 className="text-lg font-worksans font-medium text-zinc-800 mb-3">Study Pace</h3>
                        <div className="flex flex-wrap gap-3">
                          {['Slow', 'Moderate', 'Fast'].map(pace => (
                            <DayPill key={pace} day={pace} isSelected={studyPace === pace} onClick={() => setStudyPace(pace)} />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-worksans font-medium text-zinc-800 mb-3">Study Mode</h3>
                        <div className="flex flex-wrap gap-3">
                          {['Online', 'In-person', 'Both'].map(mode => (
                            <DayPill key={mode} day={mode} isSelected={studyMode === mode} onClick={() => setStudyMode(mode)} />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-worksans font-medium text-zinc-800 mb-3">Group Size</h3>
                        <div className="flex flex-wrap gap-3">
                          {['Small Group', 'Large Group'].map(size => (
                            <DayPill key={size} day={size} isSelected={groupSize === size} onClick={() => setGroupSize(size)} />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-worksans font-medium text-zinc-800 mb-4">Learning Style</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {learningStyles.map((style) => (
                            <LearningStyleCard
                              key={style.id}
                              title={style.title}
                              description={style.description}
                              isSelected={studyStyle === style.id}
                              onClick={() => setStudyStyle(style.id)}
                            />
                          ))}
                        </div>
                      </div>

                    </div>
                  </section>
                </div>

                <div className="mt-12 flex justify-end gap-4 border-t border-stone-200 pt-8">
                  <button onClick={() => navigate('/profile')} className="px-6 py-3 bg-white text-zinc-900 border-2 border-black rounded-xl font-worksans font-semibold hover:-translate-y-1 transition-transform">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={isSaving} className="px-8 py-3 bg-[#efd476] border-2 border-black text-zinc-900 shadow-[4px_4px_0px_#000] rounded-xl font-worksans font-bold hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:-translate-y-0">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
