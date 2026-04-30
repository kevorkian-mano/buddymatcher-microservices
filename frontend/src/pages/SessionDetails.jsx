import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_SESSION_BY_ID } from '../graphql/queries/sessionQueries';
import { GET_USER_BY_ID } from '../graphql/queries/userQueries';
import { Header, Breadcrumb, Sidebar } from '../components/dashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ParticipantItem = ({ participant, navigate }) => {
  const { data } = useQuery(GET_USER_BY_ID, {
    variables: { id: participant.userId },
    skip: !participant.userId
  });

  const name = data?.getUserById?.name || participant.userId;
  const initial = data?.getUserById?.name 
    ? data.getUserById.name.substring(0, 2).toUpperCase() 
    : participant.userId.substring(0, 2).toUpperCase();

  return (
    <div 
      onClick={() => navigate(`/buddies/${participant.userId}`)}
      className="flex items-center border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors cursor-pointer group bg-gray-50/50"
    >
      <div className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center bg-white relative shadow-sm mr-4 group-hover:border-black transition-colors shrink-0">
        <span className="font-bold text-gray-800">
          {initial}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-bold tracking-tight text-gray-900 truncate" title={name}>
          {name}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider mt-1 text-gray-500">
          Status: {participant.status}
        </p>
      </div>
    </div>
  );
};

const SessionDetails = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "User" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const { loading, error, data } = useQuery(GET_SESSION_BY_ID, {
    variables: { id: sessionId },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-red-500 font-worksans">Error: {error.message}</div>;
  
  const session = data?.getSessionById;
  if (!session) return <div className="p-8 font-worksans">Session not found.</div>;

  const d = new Date(parseInt(session.startTime) || session.startTime);
  const isPast = session.status === 'COMPLETED' || d.getTime() < new Date().getTime();

  return (
    <div className="overflow-hidden pr-6 md:pr-8 lg:pr-12 pl-0 pt-4 md:pt-6 pb-20 md:pb-28 bg-white min-h-screen relative">
      <div className="max-w-[1800px] mx-auto z-10 relative flex flex-col w-full h-full"> 
        {/* Header section */}
        <div className="w-full flex flex-col mb-10 pl-6 md:pl-8 lg:pl-12">
          <Header userName={user.name} />
          <div className="mt-4"><Breadcrumb /></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
          {/* Sidebar */}
          <div className="hidden lg:block w-[300px] shrink-0 sticky top-6">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 w-full min-w-0 px-4 md:px-8">
            <main className="flex-1 font-worksans max-w-5xl">
              
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-600 hover:text-black font-semibold transition-colors group"
                >
                  <span className="text-xl mr-2">←</span> Back to Sessions
                </button>
              </div>

              <div className="border border-gray-300 rounded-[2.5rem] p-8 md:p-12 bg-white shadow-sm">
                <div className="flex flex-wrap justify-between items-start mb-8 gap-4">
                  <h1 className="text-[40px] md:text-[52px] font-playfair font-extrabold italic text-zinc-900 leading-[1.1] max-w-[70%]">
                    {session.topic}
                  </h1>
                  <div className={`bg-black text-white px-5 py-2 rounded-full flex items-center text-sm tracking-wide ${isPast ? 'opacity-50' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${isPast ? 'bg-gray-400' : 'bg-green-400'}`}></div>
                    {isPast ? 'Completed' : 'Upcoming'}
                  </div>
                </div>

                <div className="flex flex-wrap gap-8 text-gray-600 mb-8 font-medium text-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {d.toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {session.duration} mins
                  </div>
                  <div className="flex items-center">
                    {(session.sessionType === 'VIRTUAL' || session.sessionType === 'ONLINE') ? (
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    )}
                    {session.location || "TBD"}
                  </div>
                </div>

                <div className="bg-[#dcdcdc]/40 p-4 rounded-2xl text-gray-700 font-medium text-15px mb-8 border border-gray-200/50 flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <span className="text-gray-500 mr-2">Creator Contact:</span> 
                    {session.creatorContactInfo || "No contact info listed"}
                  </div>
                  <button className="text-sm border border-gray-300 px-4 py-1.5 rounded-lg bg-white hover:bg-gray-50 transition-colors mt-3 md:mt-0">
                    Copy Info
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-playfair font-bold text-gray-900">
                      Participants ({session.participants?.length || 0})
                    </h3>
                  </div>
                  
                  {session.participants?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {session.participants.map((participant, index) => (
                        <ParticipantItem 
                          key={index} 
                          participant={participant} 
                          navigate={navigate} 
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic font-medium">No one has joined yet.</p>
                  )}
                </div>

              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;
