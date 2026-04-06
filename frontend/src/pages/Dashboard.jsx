import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql/queries/dashboardQueries';
import { Header, Breadcrumb, Sidebar, StatsCard, SessionCard, BuddyCard } from '../components/dashboard';

function Dashboard() {
  const [user, setUser] = React.useState({ name: "Alex" });

  React.useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const { data } = useQuery(GET_DASHBOARD_DATA, {
    fetchPolicy: 'network-only',
    // Fallback in case backend endpoints throw errors during the new user setup
    errorPolicy: 'all'
  });

  const sessions = data?.getSessions || [];
  const matches = data?.getPotentialMatches || [];

  const statsData = [
    { value: sessions.length.toString(), label: "Study Sessions" },
    { value: matches.length.toString(), label: "Active Buddies" },
    { value: (sessions.length * 1.5).toString(), label: "Hours Studied", unit: "h" }
  ];

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

  const sessionsData = sessions.length > 0 ? sessions.map(s => ({
    title: s.topic,
    date: formatDate(s.startTime),
    time: `${formatTime(s.startTime)} · ${s.duration} mins`,
    location: s.location || "TBD",
    isOnline: s.sessionType === 'VIRTUAL' || s.sessionType === 'ONLINE'
  })) : [];

  const buddiesData = matches.length > 0 ? matches.map(m => ({
    name: `User ${m.userId.substring(0, 4)}`, // Backend payload only returns userId, not extended User schema
    field: "General Studies",
    school: "University",
    year: "N/A",
    matchPercentage: `${m.score}%`,
    tags: ["Matched Buddy"],
    subjects: m.commonTopics || [],
    avatar: `https://ui-avatars.com/api/?name=U&background=random&color=fff`
  })) : [];

  return (
    <div className="overflow-hidden pr-6 md:pr-8 lg:pr-12 pl-0 pt-4 md:pt-6 pb-20 md:pb-28 bg-white min-h-screen relative">
      <div className="max-w-[1800px] mx-auto z-10 relative flex flex-col w-full h-full">

        {/* Header section - Spans full width! */}
        <div className="w-full flex flex-col mb-10 pl-6 md:pl-8 lg:pl-12">
          <Header userName={user.name} />
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
                  Good evening, {user.name.split(' ')[0]}!
                </h2>
                
                <button className="flex overflow-hidden shrink-0 gap-2.5 justify-center items-center px-6 py-3 bg-white rounded-xl border-2 border-black font-worksans text-lg font-semibold shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-none hover:bg-gray-50 transition-all">
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

            {/* Feed Section */}
            <section className="flex flex-col w-full">
              
              {/* Upcoming sessions */}
              <div className="w-full mb-12">
                <div className="flex flex-wrap gap-4 justify-between items-end w-full mb-6">
                  <h2 className="text-[32px] md:text-[44px] font-playfair italic font-bold text-zinc-900 border-b-2 border-black pb-2 flex-grow mr-10">
                    Upcoming sessions
                  </h2>
                  <div className="flex gap-2 items-center text-lg font-worksans font-medium text-zinc-900 hover:opacity-80 transition-opacity cursor-pointer shrink-0 pb-2">
                    <a href="#" className="hover:underline">View all</a>
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
                  <div className="flex gap-2 items-center text-lg font-worksans font-medium text-zinc-900 hover:opacity-80 transition-opacity cursor-pointer shrink-0 pb-2">
                    <a href="#" className="hover:underline">View all</a>
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
                      name={buddy.name}
                      field={buddy.field}
                      school={buddy.school}
                      year={buddy.year}
                      matchPercentage={buddy.matchPercentage}
                      tags={buddy.tags}
                      subjects={buddy.subjects}
                      avatar={buddy.avatar}
                    />
                  ))}
                </div>
              </div>

            </section>

          </main>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;