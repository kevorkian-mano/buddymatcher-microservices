import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROFILE_BY_USER_ID } from '../graphql/queries/profileQueries';
import { GET_POTENTIAL_MATCHES } from '../graphql/queries/matchingQueries';
import { GET_DASHBOARD_DATA } from '../graphql/queries/dashboardQueries';
import { SEND_BUDDY_REQUEST } from '../graphql/mutations/matchingMutations';
import { Header, Breadcrumb, Sidebar } from '../components/dashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BuddyDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({ name: "User" });
  const [isRequestSent, setIsRequestSent] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const { loading, error, data } = useQuery(GET_PROFILE_BY_USER_ID, {
    variables: { userId },
  });

  const { data: matchesData } = useQuery(GET_POTENTIAL_MATCHES, {
    fetchPolicy: 'cache-first'
  });

  const potentialMatch = matchesData?.getPotentialMatches?.find(m => m.userId === userId);
  const internalIsRequested = potentialMatch?.requestStatus === 'PENDING';
  const displayRequested = isRequestSent || internalIsRequested;

  const [sendBuddyRequest, { loading: connecting }] = useMutation(SEND_BUDDY_REQUEST, {
    refetchQueries: [
      { query: GET_POTENTIAL_MATCHES },
      { query: GET_DASHBOARD_DATA }
    ],
    onCompleted: () => {
      setIsRequestSent(true);
    },
    onError: (err) => {
      console.error(err);
      alert('Failed to send connect request: ' + err.message);
    }
  });

  const handleConnect = async () => {
    if (!userId || displayRequested) return;
    try {
      await sendBuddyRequest({ variables: { toUser: userId } });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-red-500 font-worksans">Error: {error.message}</div>;
  
  const user = data?.getUserById;
  const rawProfile = data?.getProfileByUserId;
  const avail = data?.getAvailabilityByUserId;

  if (!user && !rawProfile) return <div className="p-8 font-worksans">Profile not found.</div>;

  const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const profile = {
    userId: user?.name || "Buddy",
    major: user?.major || "Undecided major",
    year: user?.academicYear || "1st Year",
    studyPacing: rawProfile?.preferences?.studyPace || "Not specified",
    learningStyle: rawProfile?.preferences?.studyStyle || "Not specified",
    availability: avail ? avail.map(a => ({
      day: daysMap[a.dayOfWeek] || `Day ${a.dayOfWeek}`,
      startTime: a.startTime,
      endTime: a.endTime
    })) : [],
    courses: rawProfile?.courses?.map(c => c.name) || [],
    topics: rawProfile?.topics?.map(t => t.name) || []
  };

  return (
    <div className="overflow-hidden pr-6 md:pr-8 lg:pr-12 pl-0 pt-4 md:pt-6 pb-20 md:pb-28 bg-white min-h-screen relative w-full"> 
      <div className="w-full max-w-none mx-0 z-10 relative flex flex-col h-full"> 
        {/* Header section spanning full width */}
        <div className="w-full flex flex-col mb-10 pl-6 md:pl-8 lg:pl-12">
          <Header userName={currentUser.name} />
          <div className="mt-4"><Breadcrumb /></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
          {/* Sidebar Area Desktop */}
          <div className="hidden lg:block w-[300px] shrink-0 sticky top-4">
            <Sidebar />
          </div>

          <div className="flex flex-col flex-1 w-full min-w-0 pr-4">
            <main className="flex flex-col w-full max-w-[900px]">
              
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-zinc-600 hover:text-black font-worksans font-medium mb-6 transition-colors"
              >
                ← Back to Matching
              </button>

              {/* Profile Header mimicking MyProfile */}
              <header className="flex flex-col w-full px-4 md:px-0">
                <h1 className="text-[36px] md:text-[44px] font-playfair italic font-extrabold text-zinc-900 leading-[1.1] mb-6">
                  {profile.userId}'s Profile
                </h1>
                
                <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center bg-white p-6 md:p-8 rounded-3xl border-2 border-black relative shadow-[4px_4px_0px_#000]">
                  <div className="shrink-0 w-[120px] md:w-[150px] aspect-square rounded-full border-4 border-black overflow-hidden bg-amber-100 flex items-center justify-center">
                    <h2 className="text-4xl md:text-5xl font-playfair font-extrabold text-zinc-900">
                      {profile.userId?.substring(0, 2).toUpperCase() || 'U'}
                    </h2>
                  </div>

                  <div className="flex flex-col flex-1 w-full">
                    <h2 className="text-3xl md:text-4xl text-zinc-900 font-playfair font-bold">
                      {profile.userId}
                    </h2>
                    
                    <div className="flex flex-wrap gap-2 items-center text-lg font-worksans text-zinc-600 mt-2 mb-4">
                      <span>{profile.major}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{profile.year}</span>
                    </div>

                    <p className="text-base md:text-lg font-worksans leading-relaxed text-zinc-800">
                      Passionate student looking for collaborative learning and motivated study partners.
                    </p>
                  </div>

                  <button 
                    onClick={handleConnect}
                    disabled={displayRequested || connecting}
                    className={`md:absolute top-8 right-8 flex items-center justify-center px-6 py-3 rounded-xl text-lg font-worksans font-medium transition-colors shadow-[2px_2px_0px_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none ${
                      displayRequested 
                        ? 'bg-green-100 text-green-800 border-2 border-green-500 cursor-not-allowed shadow-none translate-y-[2px] translate-x-[2px]' 
                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                    }`}
                  >
                    {displayRequested ? (
                       <span className="flex items-center">
                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                         Requested
                       </span>
                     ) : connecting ? (
                       'Connecting...'
                     ) : (
                       '+ Connect'
                     )}
                  </button>
                </div>
              </header>

              <div className="w-full mt-10 px-4 md:px-0">
                {/* Content matching StudyPreferencesTab vibe */}
                <div className="flex flex-col gap-6">
                  <div className="bg-white p-6 border-2 border-black rounded-3xl shadow-[4px_4px_0px_#000]">
                    <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-6">Learning DNA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Study Pace</span>
                        <div className="text-lg font-worksans font-medium text-zinc-900 bg-stone-100 px-4 py-3 rounded-xl border border-stone-200">
                          {profile.studyPacing}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Learning Style</span>
                        <div className="text-lg font-worksans font-medium text-zinc-900 bg-stone-100 px-4 py-3 rounded-xl border border-stone-200">
                          {profile.learningStyle}
                        </div>
                      </div>
                    </div>
                    
                    {profile.courses.length > 0 && (
                      <div className="mt-8">
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Courses</span>
                        <div className="flex flex-wrap gap-2">
                          {profile.courses.map((c, i) => (
                            <span key={i} className="px-4 py-2 border-2 border-black bg-white rounded-lg text-sm font-bold text-zinc-900 shadow-[2px_2px_0px_#000]">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.topics.length > 0 && (
                      <div className="mt-6">
                         <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Topics</span>
                         <div className="flex flex-wrap gap-2">
                           {profile.topics.map((t, i) => (
                             <span key={i} className="px-4 py-2 bg-stone-100 border border-stone-200 rounded-lg text-sm font-medium text-zinc-800">{t}</span>
                           ))}
                         </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 border-2 border-black rounded-3xl shadow-[4px_4px_0px_#000] mb-6">
                    <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-6">Availability</h3>
                    {profile.availability.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {profile.availability.map((av, idx) => (
                           <div key={idx} className="flex justify-between items-center text-lg font-worksans font-medium text-zinc-900 bg-stone-100 px-4 py-3 rounded-xl border border-stone-200">
                             <span>{av.day}</span>
                             <span>{av.startTime} - {av.endTime}</span>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-500 font-worksans text-lg">No schedule listed.</p>
                    )}
                  </div>

                  {(profile.courses.length > 0 || profile.topics.length > 0) && (
                    <div className="bg-white p-6 border-2 border-black rounded-3xl shadow-[4px_4px_0px_#000] mb-8">
                      <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-6">Courses &amp; Topics</h3>

                      {profile.courses.length > 0 && (
                        <div className="mb-6">
                          <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Courses</span>
                          <div className="grid grid-cols-1 gap-3">
                            {profile.courses.map((c, i) => (
                              <div key={i} className="flex items-center text-lg font-worksans font-medium text-zinc-900 bg-stone-100 px-4 py-3 rounded-xl border border-stone-200">
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {profile.topics.length > 0 && (
                        <div>
                          <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Topics</span>
                          <div className="grid grid-cols-1 gap-3">
                            {profile.topics.map((t, i) => (
                              <div key={i} className="flex items-center text-lg font-worksans font-medium text-zinc-900 bg-stone-100 px-4 py-3 rounded-xl border border-stone-200">
                                <span>{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuddyDetails;
