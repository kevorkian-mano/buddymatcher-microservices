import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql/queries/dashboardQueries';
import { GET_POTENTIAL_MATCHES } from '../graphql/queries/matchingQueries';
import { GET_ALL_USERS } from '../graphql/queries/userQueries';
import { SEND_BUDDY_REQUEST } from '../graphql/mutations/matchingMutations';
import { Header, Breadcrumb, Sidebar, StatsCard, SessionCard, BuddyCard } from '../components/dashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';

function Dashboard() {
  const [user, setUser] = React.useState({ id: "", name: "Alex" });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchFilter, setSearchFilter] = React.useState('all'); // all, buddies, sessions
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const { data, loading: dashboardLoading } = useQuery(GET_DASHBOARD_DATA, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  });

  const { data: usersData, loading: usersLoading } = useQuery(GET_ALL_USERS, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  });

  const [sendBuddyRequest] = useMutation(SEND_BUDDY_REQUEST, {
    refetchQueries: [
      { query: GET_DASHBOARD_DATA },
      { query: GET_POTENTIAL_MATCHES }
    ]
  });

  const handleConnect = (userId) => {
    sendBuddyRequest({ variables: { toUser: userId } }).catch(err => console.error(err));
  };

  if (dashboardLoading || usersLoading) return <LoadingSpinner />;

  const sessions = data?.getSessions || [];
  const matches = data?.getPotentialMatches || [];
  const connections = data?.getConnections || [];

  const createdByUserSessions = sessions.filter(s => s.creatorId === user.id);
  /* 'Active Buddies' implies Connections made. */
  const activeBuddiesCount = connections.length;
  
  /* Filter only the ones they participated in */
  const participatedSessions = sessions.filter(s => 
    s.creatorId === user.id || s.participants?.some(p => p.userId === user.id)
  );

  /* Compute hours studied for past participated sessions only */
  const completedSessions = participatedSessions.filter(s => 
    s.status === 'COMPLETED' || new Date(parseInt(s.startTime) || s.startTime) < new Date()
  );
  const hoursStudied = completedSessions.reduce((acc, s) => acc + (s.duration / 60), 0);

  const statsData = [
    { value: createdByUserSessions.length.toString(), label: "Study Sessions Created" },
    { value: activeBuddiesCount.toString(), label: "Connections" },
    { value: Math.round(hoursStudied).toString(), label: "Total hours", unit: "h" }
  ];

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Helper to format date
  const formatDate = (isoString) => {
    const d = new Date(parseInt(isoString) || isoString);
    if (isNaN(d.getTime())) return "TBD";
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (isoString) => {
    const d = new Date(parseInt(isoString) || isoString);
    if (isNaN(d.getTime())) return "TBD time";
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Only upcoming unterminated sessions that the user is a part of (joined or created)
  const upcomingSessionsList = participatedSessions
    .filter(s => s.status !== 'COMPLETED' && new Date(parseInt(s.startTime) || s.startTime) >= new Date())
    .sort((a, b) => new Date(parseInt(a.startTime) || a.startTime) - new Date(parseInt(b.startTime) || b.startTime));

  const sessionsData = upcomingSessionsList.length > 0 ? upcomingSessionsList.map(s => ({
    id: s.id,
    title: s.topic,
    date: formatDate(s.startTime),
    time: `${formatTime(s.startTime)} · ${s.duration} mins`,
    location: s.location || "TBD",
    isOnline: s.sessionType === 'VIRTUAL' || s.sessionType === 'ONLINE'
  })) : [];

  // Top suggestions matches ordered by score descending
  const topMatches = [...matches].sort((a,b) => b.score - a.score).slice(0, 2);

  const buddiesData = topMatches.length > 0 ? topMatches.map(m => {
    const matchedUser = usersData?.getAllUsers?.find(u => u.id === m.userId);
    const name = matchedUser?.name || `User ${m.userId.substring(0, 4)}`;
    const major = matchedUser?.major || "General Studies";
    const university = matchedUser?.university || "University";

    return {
      userId: m.userId,
      name,
      field: major,
      school: university,
      year: "N/A", // Not all users have this field
      matchPercentage: `${Math.round(m.score)}%`,
      tags: m.reason ? [m.reason] : ["Matched Buddy"],
      subjects: m.commonTopics || [],
      avatar: `https://ui-avatars.com/api/?name=${name[0]}&background=random&color=fff`,
      isRequested: m.requestStatus === 'PENDING'
    };
  }) : [];

  // Search logic
  const isSearching = searchQuery.trim().length > 0;
  const lowerQuery = searchQuery.toLowerCase();

  const allFilteredBuddies = isSearching ? (usersData?.getAllUsers || []).filter(u => 
    u.id !== user.id && u.name.toLowerCase().includes(lowerQuery)
  ).map(u => ({
    userId: u.id,
    name: u.name || `User ${u.id.substring(0, 4)}`,
    field: u.major || "General Studies",
    school: u.university || "University",
    year: "N/A",
    matchPercentage: `N/A`,
    tags: ["User"],
    subjects: u.interests || [],
    avatar: `https://ui-avatars.com/api/?name=${(u.name || "U")[0]}&background=random&color=fff`,
    isRequested: false
  })) : [];

  const allFilteredSessions = isSearching ? sessions.filter(s => 
    s.topic.toLowerCase().includes(lowerQuery) || (s.location && s.location.toLowerCase().includes(lowerQuery))
  ).map(s => ({
    id: s.id,
    title: s.topic,
    date: formatDate(s.startTime),
    time: `${formatTime(s.startTime)} · ${s.duration} mins`,
    location: s.location || "TBD",
    isOnline: s.sessionType === 'VIRTUAL' || s.sessionType === 'ONLINE'
  })) : [];


  return (
    <div className="overflow-hidden pr-6 md:pr-8 lg:pr-12 pl-0 pt-4 md:pt-6 pb-20 md:pb-28 bg-white min-h-screen relative">
      <div className="max-w-[1800px] mx-auto z-10 relative flex flex-col w-full h-full">

        {/* Header section - Spans full width! */}
        <div className="w-full flex flex-col mb-10 pl-6 md:pl-8 lg:pl-12">
          <Header userName={user.name} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <Breadcrumb />
        </div>

        <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
          {/* Sidebar Area */}
          <div className="hidden lg:block w-[300px] shrink-0 sticky top-6">
            <Sidebar />
          </div>

            {/* Main Dashboard Content */}
            <div className="flex flex-col flex-1 w-full min-w-0">
              
              <main className="flex flex-col w-full">            <div className="w-full">
                <div className="flex flex-wrap md:flex-nowrap gap-6 justify-between items-center w-full mb-10">
                  <h2 className="text-[44px] md:text-[56px] font-playfair italic font-extrabold text-zinc-900 leading-[1.1]">
                    {getGreeting()}, {user.name.split(' ')[0]}!
                  </h2>
                  
                  <button 
                    onClick={() => navigate('/matching')}
                    className="flex overflow-hidden shrink-0 gap-2.5 justify-center items-center px-6 py-3 bg-white rounded-xl border-2 border-black font-worksans text-lg font-semibold shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-none hover:bg-gray-50 transition-all">
                    Find new buddies
                  </button>
                </div>         
              {/* Stats Row */}
              <div className="flex flex-wrap lg:flex-nowrap gap-6 items-center w-full mb-16">
                {statsData.map((stat, index) => (
                  <StatsCard
                    key={index}
                    value={stat.value}
                    label={stat.label}
                    unit={stat.unit}
                  />
                ))}
              </div>
            </div>

            {/* Main Content */}
            <section className="flex flex-col w-full">
              {isSearching ? (
                <div className="w-full">
                  <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
                    <button 
                      onClick={() => setSearchFilter('all')}
                      className={`px-4 py-2 rounded-full font-worksans text-sm font-semibold transition-colors ${searchFilter === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      All Results
                    </button>
                    <button 
                      onClick={() => setSearchFilter('buddies')}
                      className={`px-4 py-2 rounded-full font-worksans text-sm font-semibold transition-colors ${searchFilter === 'buddies' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Buddies ({allFilteredBuddies.length})
                    </button>
                    <button 
                      onClick={() => setSearchFilter('sessions')}
                      className={`px-4 py-2 rounded-full font-worksans text-sm font-semibold transition-colors ${searchFilter === 'sessions' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Sessions ({allFilteredSessions.length})
                    </button>
                  </div>

                  {(searchFilter === 'all' || searchFilter === 'sessions') && allFilteredSessions.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-2xl font-playfair font-bold mb-4">Sessions</h3>
                      <div className="flex flex-col gap-4">
                        {allFilteredSessions.map(session => (
                          <SessionCard
                            key={session.id}
                            id={session.id}
                            onClick={() => navigate(`/sessions/${session.id}`)}
                            title={session.title}
                            date={session.date}
                            time={session.time}
                            location={session.location}
                            isOnline={session.isOnline}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {(searchFilter === 'all' || searchFilter === 'buddies') && allFilteredBuddies.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-2xl font-playfair font-bold mb-4">Buddies</h3>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full mt-5">
                        {allFilteredBuddies.map(buddy => (
                          <BuddyCard
                            key={buddy.userId}
                            userId={buddy.userId}
                            onClick={() => navigate(`/buddies/${buddy.userId}`)}
                            name={buddy.name}
                            field={buddy.field}
                            school={buddy.school}
                            year={buddy.year}
                            matchPercentage={buddy.matchPercentage}
                            tags={buddy.tags}
                            subjects={buddy.subjects}
                            avatar={buddy.avatar}
                            isRequested={buddy.isRequested}
                            onConnect={handleConnect}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {allFilteredSessions.length === 0 && allFilteredBuddies.length === 0 && (
                    <div className="text-center py-20">
                      <p className="text-xl text-gray-500 font-worksans">No results found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  {/* Upcoming sessions */}
                  <div className="w-full mb-12">
                    <div className="flex flex-wrap gap-4 justify-between items-end w-full mb-6">
                      <h2 className="text-[32px] md:text-[44px] font-playfair italic font-bold text-zinc-900 border-b-2 border-black pb-2 flex-grow mr-10">
                        Upcoming sessions
                      </h2>
                      <div onClick={() => navigate('/sessions?tab=upcoming')} className="flex gap-2 items-center text-lg font-worksans font-medium text-zinc-900 hover:opacity-80 transition-opacity cursor-pointer shrink-0 pb-2">
                        <span className="hover:underline">View all</span>
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/3775dd5e7795fe02016b84e1586c9a9d26b49e2d?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
                          className="object-contain w-6 aspect-[1.13]"
                          alt="Arrow right"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      {sessionsData.map((session, index) => (
                        <SessionCard
                          key={index}
                          id={session.id}
                          onClick={() => navigate(`/sessions/${session.id}`)}
                          title={session.title}
                          date={session.date}
                          time={session.time}
                          location={session.location}
                          isOnline={session.isOnline}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Buddy recommendations */}
                  <div className="w-full">
                    <div className="flex flex-wrap gap-4 justify-between items-end w-full mb-6">
                      <h2 className="text-[32px] md:text-[44px] font-playfair italic font-bold text-zinc-900 border-b-2 border-black pb-2 flex-grow mr-10">
                        Recommended for you
                      </h2>
                      <div onClick={() => navigate('/matching')} className="flex gap-2 items-center text-lg font-worksans font-medium text-zinc-900 hover:opacity-80 transition-opacity cursor-pointer shrink-0 pb-2">
                        <span className="hover:underline">View all</span>
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/77845a99907a8d6bba0926a21eadbeda602c0b35?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
                          className="object-contain w-6 aspect-[1.13]"
                          alt="Arrow right"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full mt-5">
                      {buddiesData.map((buddy, index) => (
                        <BuddyCard
                          key={index}
                          userId={buddy.userId}
                          onClick={() => navigate(`/buddies/${buddy.userId}`)}
                          name={buddy.name}
                          field={buddy.field}
                          school={buddy.school}
                          year={buddy.year}
                          matchPercentage={buddy.matchPercentage}
                          tags={buddy.tags}
                          subjects={buddy.subjects}
                          avatar={buddy.avatar}
                          isRequested={buddy.isRequested}
                          onConnect={handleConnect}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

          </main>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;