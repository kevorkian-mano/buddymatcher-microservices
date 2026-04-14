import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SESSIONS } from '../graphql/queries/sessionQueries';
import { CREATE_SESSION, JOIN_SESSION, TERMINATE_SESSION } from '../graphql/mutations/sessionMutations';
import { Header, Breadcrumb, Sidebar } from '../components/dashboard';

import { GET_USER_BY_ID, GET_ALL_USERS } from '../graphql/queries/userQueries';
import { GET_CONNECTIONS } from '../graphql/queries/matchingQueries';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SessionCreatorName = ({ creatorId }) => {
  const { data } = useQuery(GET_USER_BY_ID, {
    variables: { id: creatorId },
    skip: !creatorId
  });

  if (data?.getUserById?.name) {
    return <span>Created by {data.getUserById.name}</span>;
  }
  return <span>Created by User...</span>;
};

const Sessions = () => {
  const [user, setUser] = useState({ name: "User" });
  const [mainTab, setMainTab] = useState('available'); // 'available', 'joined', 'created'
  const [subTab, setSubTab] = useState('upcoming');     // 'upcoming', 'completed', 'all'
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const { data, loading, refetch } = useQuery(GET_SESSIONS, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  });
  
  const [joinSession] = useMutation(JOIN_SESSION, {
    onCompleted: () => refetch()
  });

  const [terminateSession] = useMutation(TERMINATE_SESSION, {
    onCompleted: () => refetch()
  });

  if (loading) return <LoadingSpinner />;

  const getSessionsList = () => {
    if (!data?.getSessions) return [];
    return data.getSessions.map(session => {
      const d = new Date(parseInt(session.startTime) || session.startTime);
      const isPast = session.status === 'COMPLETED' || d.getTime() < new Date().getTime();
      const hasJoined = session.participants?.some(p => p.userId === user.id);
      
      return {
        id: session.id,
        title: session.topic || "Study Session",
        date: d.toLocaleDateString(),
        time: `${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • ${session.duration} mins`,
        location: session.location || "TBD",
        creatorId: session.creatorId,
        participants: session.participants?.length || 0,
        isOnline: session.sessionType === 'VIRTUAL' || session.sessionType === 'ONLINE',
        isPast,
        hasJoined,
        isCreator: session.creatorId === user.id,
        status: session.status
      };
    });
  };

  const allSessions = getSessionsList();
  
  const createdByMeSessions = allSessions.filter(s => s.isCreator);
  const availableSessions = allSessions.filter(s => !s.isPast && !s.isCreator && !s.hasJoined);
  const joinedSessions = allSessions.filter(s => s.hasJoined && !s.isCreator);

  let displayData = [];
  if (mainTab === 'created') displayData = createdByMeSessions;
  else if (mainTab === 'available') displayData = availableSessions;
  else if (mainTab === 'joined') {
    if (subTab === 'upcoming') displayData = joinedSessions.filter(s => !s.isPast);
    else if (subTab === 'completed') displayData = joinedSessions.filter(s => s.isPast);
    else displayData = joinedSessions;
  }

  const handleJoin = async (id) => {
    try {
      await joinSession({ variables: { sessionId: id } });
    } catch(err) {
      console.error(err);
      alert('Error joining session');
    }
  };

  const handleTerminate = async (id) => {
    if(window.confirm('Are you sure you want to terminate this session early? This will mark it as Completed.')){
      try {
        await terminateSession({ variables: { sessionId: id, status: 'COMPLETED' } });
      } catch(err) {
        console.error(err);
        alert('Error terminating session');
      }
    }
  };

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
              
              {/* Header row */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-[44px] md:text-[56px] font-playfair font-extrabold italic text-zinc-900 leading-[1.1]">
                  Study Sessions
                </h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-800 font-medium"
                >
                  Schedule session +
                </button>
              </div>
              <p className="text-gray-600 mb-8 text-lg font-medium">{displayData.length} sessions</p>
              
              {/* Main Tabs */}
              <div className="flex space-x-4 mb-6 border-b border-gray-200 pb-2">
                <button 
                  onClick={() => setMainTab('available')}
                  className={`px-4 py-2 font-medium border-b-2 transition-colors ${mainTab === 'available' ? 'border-[#d6a546] text-black text-lg' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                >
                  Available to Join
                </button>
                <button 
                  onClick={() => setMainTab('joined')}
                  className={`px-4 py-2 font-medium border-b-2 transition-colors ${mainTab === 'joined' ? 'border-[#d6a546] text-black text-lg' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                >
                  Joined Sessions
                </button>
                <button 
                  onClick={() => setMainTab('created')}
                  className={`px-4 py-2 font-medium border-b-2 transition-colors ${mainTab === 'created' ? 'border-[#d6a546] text-black text-lg' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                >
                  Created by Me
                </button>
              </div>

              {/* Sub Tabs (Only for Joined) */}
              {mainTab === 'joined' && (
                <div className="flex space-x-4 mb-8">
                  <button 
                    onClick={() => setSubTab('upcoming')}
                    className={`px-8 py-2.5 rounded-xl border transition-colors text-sm ${subTab === 'upcoming' ? 'bg-[#FBE58D] border-[#d6a546] font-medium' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    Upcoming ({joinedSessions.filter(s => !s.isPast).length})
                  </button>
                  <button 
                    onClick={() => setSubTab('completed')}
                    className={`px-8 py-2.5 rounded-xl border transition-colors text-sm ${subTab === 'completed' ? 'bg-[#FBE58D] border-[#d6a546] font-medium' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    Completed ({joinedSessions.filter(s => s.isPast).length})
                  </button>
                  <button 
                    onClick={() => setSubTab('all')}
                    className={`px-8 py-2.5 rounded-xl border transition-colors text-sm ${subTab === 'all' ? 'bg-[#FBE58D] border-[#d6a546] font-medium' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    All ({joinedSessions.length})
                  </button>
                </div>
              )}
              
              {mainTab !== 'joined' && (
                  <hr className="border-t-[1.5px] border-gray-300 mb-8 mt-4" />
              )}              {/* Session Cards list */}
              <div className="space-y-6">
                {displayData.map((session) => (
                  <div key={session.id} className="border border-gray-300 rounded-[2.5rem] p-8 bg-white hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-4xl font-playfair text-zinc-800">{session.title}</h3>
                      <div className={`bg-black text-white px-5 py-2 rounded-full flex items-center text-xs tracking-wide ${session.isPast ? 'opacity-50' : ''}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${session.isPast ? 'bg-gray-400' : 'bg-green-400'}`}></div>
                        {session.isPast ? 'Completed' : 'Upcoming'}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-8 text-gray-600 mb-6 font-medium">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {session.date}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {session.time}
                      </div>
                      <div className="flex items-center">
                        {session.isOnline ? (
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        ) : (
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        )}
                        {session.location}
                      </div>
                    </div>

                      <div className="bg-[#dcdcdc]/40 p-4 rounded-2xl text-gray-700 font-medium text-15px mb-8 border border-gray-200/50">
                        <SessionCreatorName creatorId={session.creatorId} />
                      </div>                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="flex -space-x-4">
                          <div className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center bg-white relative z-[1]">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                          </div>
                          <div className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center bg-white relative z-[2]">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                          </div>
                          <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center bg-white relative z-[3] shadow-sm">
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                          </div>
                        </div>
                        <span className="ml-6 text-gray-600 font-medium text-md">{session.participants} participants</span>
                      </div>
                      {session.isCreator && !session.isPast ? (
                        <button 
                          onClick={() => handleTerminate(session.id)}
                          className="bg-red-500 text-white hover:bg-red-600 px-10 py-3 rounded-2xl transition-colors font-medium flex items-center shadow-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          Terminate
                        </button>
                      ) : (
                          <button 
                            onClick={() => !session.hasJoined && !session.isCreator && handleJoin(session.id)}
                            disabled={session.isPast || session.hasJoined || session.isCreator}
                            className={`px-10 py-3 rounded-2xl transition-colors font-medium flex items-center ${
                              session.isPast 
                                ? 'bg-[#2d2d2d] text-white opacity-50 cursor-not-allowed'
                                : session.isCreator
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200 cursor-default'
                                  : session.hasJoined 
                                  ? 'bg-green-100 text-green-800 border border-green-200 cursor-default'
                                  : 'bg-[#2d2d2d] text-white hover:bg-black'
                            }`}
                          >
                            {!session.hasJoined && !session.isCreator && (
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            )}
                            {session.isPast ? 'Ended' : session.isCreator ? 'Your Session' : session.hasJoined ? 'Joined' : 'Join'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

            </main>
          </div>
        </div>
      </div>

      {/* Schedule Session Modal */}
      {isModalOpen && (
        <ScheduleSessionModal onClose={() => setIsModalOpen(false)} onSessionScheduled={() => refetch()} />
      )}
    </div>
  );
};

export default Sessions;

// Embedded Modal Component
const ScheduleSessionModal = ({ onClose, onSessionScheduled }) => {
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('1 hour');
  const [selectedType, setSelectedType] = useState('ONLINE');
  const [invitedUserIds, setInvitedUserIds] = useState([]);

  const { data: usersData, error: usersError } = useQuery(GET_ALL_USERS, { fetchPolicy: 'network-only' });
  const { data: connectionsData, error: connectionsError } = useQuery(GET_CONNECTIONS, { fetchPolicy: 'network-only' });
  const [createSession] = useMutation(CREATE_SESSION);

  console.log("Users error:", usersError);
  console.log("Connections error:", connectionsError);
  console.log("Connections data:", connectionsData);
  console.log("Users data:", usersData);

  const connectedIds = connectionsData?.getConnections?.map(c => c.userId) || [];
  const allUsers = usersData?.getAllUsers?.filter(u => connectedIds.includes(u.id)) || [];

  const handleUserToggle = (id) => {
    setInvitedUserIds(prev => 
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!topic || !date || !time) return alert("Fill in the fields");
    
    // Convert duration like "1 hour" / "30 min" to int
    let durationInt = 60;
    if (selectedDuration.includes('30')) durationInt = 30;
    else if (selectedDuration.includes('1.5')) durationInt = 90;
    else if (selectedDuration.includes('2')) durationInt = 120;
    else if (selectedDuration.includes('3')) durationInt = 180;
    
    // Try to construct iso string
    let startTime;
    try {
      const d = new Date(`${date} ${time}`);
      startTime = d.toISOString();
    } catch(e) {
      startTime = new Date().toISOString();
    }
    
    try {
      await createSession({
        variables: {
          topic,
          startTime,
          duration: durationInt,
          sessionType: selectedType,
          location: selectedType === 'ONLINE' ? 'Online link will be provided' : 'TBD Location',
          invitedUserIds: invitedUserIds.length > 0 ? invitedUserIds : undefined
        }
      });
      if(onSessionScheduled) onSessionScheduled();
      onClose();
    } catch(err) {
      console.error(err);
      alert("Failed scheduling session");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl p-10 relative font-worksans shadow-2xl overflow-y-auto max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-black transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="text-5xl md:text-[52px] font-playfair font-extrabold italic text-center text-zinc-900 mb-10 tracking-tight mt-4">
          Schedule Study Session
        </h2>

        <div className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Subject / Topic</label>
            <input 
              value={topic}
              onChange={e => setTopic(e.target.value)}
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Date</label>
              <input 
                value={date}
                onChange={e => setDate(e.target.value)}
                type="date" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Time</label>
              <input 
                value={time}
                onChange={e => setTime(e.target.value)}
                type="time" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Duration</label>
            <div className="flex flex-wrap gap-2 text-sm">
              {['30 min', '1 hour', '1.5 hours', '2 hours', '3+ hours'].map(d => (
                <button 
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  className={`px-5 py-2.5 rounded-full border transition-colors ${selectedDuration === d ? 'bg-[#fcf8e3] border-[#d6a546] text-gray-800 font-medium' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Location/Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Location/Format</label>
            <div className="flex space-x-3">
              {['ONLINE', 'IN_PERSON'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-colors flex-1 ${selectedType === type ? 'bg-black text-white border-black' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Invite Users */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Invite Buddies (Optional)</label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-xl p-2 space-y-1">
                {usersError && <p className="text-red-500 text-sm">Error Loading Users: {usersError.message}</p>}
                {connectionsError && <p className="text-red-500 text-sm">Error Loading Connections: {connectionsError.message}</p>}
                {allUsers.length === 0 && !usersError && !connectionsError ? (
                  <p className="text-gray-500 p-2 text-sm">No users available. Ensure you have accepted buddies.</p>
                ) : (
                allUsers.map(u => (
                  <div key={u.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <input 
                      type="checkbox" 
                      checked={invitedUserIds.includes(u.id)}
                      onChange={() => handleUserToggle(u.id)}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <span className="text-sm font-medium text-gray-800">{u.name}</span>
                    <span className="text-xs text-gray-500 hidden sm:inline">({u.major})</span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <button 
            onClick={handleSubmit}
            className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-medium text-lg hover:bg-black transition-colors mt-8"

          >
            Confirm & Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

