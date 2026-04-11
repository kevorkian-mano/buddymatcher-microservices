import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Header, Breadcrumb, Sidebar } from '../components/dashboard';
import { GET_POTENTIAL_MATCHES, GET_BUDDY_REQUESTS, GET_CONNECTIONS } from '../graphql/queries/matchingQueries';
import { SEND_BUDDY_REQUEST, ACCEPT_BUDDY_REQUEST, REJECT_BUDDY_REQUEST } from '../graphql/mutations/matchingMutations';
import { GET_FULL_USER_BY_ID } from '../graphql/queries/userQueries';

const MatchCard = ({ match, onConnect }) => {
  const [clicked, setClicked] = useState(match.requestStatus === 'PENDING');
  const { data } = useQuery(GET_FULL_USER_BY_ID, {
    variables: { id: match.userId },
    skip: !match.userId
  });

  const userName = data?.getUserById?.name || "Loading...";
  const major = data?.getUserById?.major || "Unknown Major";
  const university = data?.getUserById?.university || "Unknown University";
  const year = data?.getUserById?.academicYear || "Year 1";

  const handleConnect = () => {
    onConnect(match.userId);
    setClicked(true);
  };

  return (
    <div className="border border-gray-300 rounded-3xl p-6 relative flex flex-col hover:shadow-lg transition-shadow bg-white">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-2xl font-playfair text-zinc-900 font-bold mb-1">{userName}</h3>
          <p className="text-gray-600 mb-1">{major}</p>
          <p className="text-sm text-gray-500 flex items-center">
            {university} · {year}
          </p>
        </div>
        <div className="text-right">
          <span className="text-gray-400 font-medium tracking-wide">{Math.round(match.score)}%</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 mb-4">
        {match.reason && <span className="px-4 py-1.5 bg-[#fcf8e3] text-sm text-gray-700 border border-[#d6a546] rounded-full">{match.reason}</span>}
        <span className="px-4 py-1.5 bg-white text-sm text-gray-600 border border-gray-300 rounded-full">{match.commonTopics?.length || 0} mutual topics</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {match.commonTopics?.map((topic, i) => (
          <span key={i} className="px-4 py-1 border border-gray-300 rounded-full text-xs text-gray-500">{topic}</span>
        ))}
      </div>

      <div className="mt-auto flex justify-between items-center space-x-3">
        <button 
          className={`flex-1 py-2.5 rounded-full text-sm font-medium flex justify-center items-center ${clicked ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#1a1a1a] text-white hover:bg-black'}`}
          onClick={handleConnect}
          disabled={clicked}
        >
          {clicked ? "Requested" : <><span className="mr-1">+</span> Connect</>}
        </button>
      </div>
    </div>
  );
};

const SuggestionsView = () => {
  const { data, loading, error, refetch } = useQuery(GET_POTENTIAL_MATCHES, { fetchPolicy: 'network-only' });
  const [sendRequest] = useMutation(SEND_BUDDY_REQUEST, {
    onCompleted: () => refetch(),
    onError: (err) => console.error(err)
  });

  if (error) {
    console.error("GraphQL Error:", error);
  }

  const matches = data?.getPotentialMatches || [];

  const handleConnect = (userId) => sendRequest({ variables: { toUser: userId } });

  return (
    <div className="max-w-4xl font-worksans">
      <h2 className="text-[44px] md:text-[56px] font-playfair font-extrabold italic text-zinc-900 leading-[1.1] mb-6">Find Study Buddies</h2>
      <p className="text-zinc-600 mb-8 text-lg">Discover compatible study partners matched to your profile</p>
      
      {loading ? <p>Loading matches...</p> : (
        <div className="grid md:grid-cols-2 gap-6">
          {matches.map((m, i) => (
             <MatchCard key={i} match={m} onConnect={handleConnect} />
          ))}
        </div>
      )}
    </div>
  );
};

const RequestCard = ({ req, onAccept, onDecline }) => {
  const { data } = useQuery(GET_FULL_USER_BY_ID, {
    variables: { id: req.fromUser },
    skip: !req.fromUser
  });

  const userName = data?.getUserById?.name || "Loading...";

  return (
    <div className="border border-gray-300 rounded-xl p-5 flex items-start justify-between bg-white hover:border-gray-400 transition-colors">
      <div className="flex flex-col max-w-lg">
        <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-2">{userName} sent a request</h3>
        <p className="text-gray-600">{userName} wants to connect with you.</p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-gray-500 text-sm mb-4">{new Date(parseInt(req.createdAt)).toLocaleDateString()}</span>
        <div className="flex space-x-3">
          <button onClick={() => onAccept(req.id)} className="px-6 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors">Accept</button>
          <button onClick={() => onDecline(req.id)} className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">Decline</button>
        </div>
      </div>
    </div>
  );
};

const RequestsView = () => {
  const { data, loading, refetch } = useQuery(GET_BUDDY_REQUESTS, { fetchPolicy: 'network-only' });
  const [acceptRequest] = useMutation(ACCEPT_BUDDY_REQUEST, { onCompleted: () => refetch() });
  const [rejectRequest] = useMutation(REJECT_BUDDY_REQUEST, { onCompleted: () => refetch() });

  const pendingRequests = (data?.getBuddyRequests || []).filter(r => r.status === "PENDING");

  return (
    <div className="max-w-4xl font-worksans">
      <h2 className="text-[44px] md:text-[56px] font-playfair font-extrabold italic text-zinc-900 leading-[1.1] mb-8">Requests</h2>
      {loading ? <p>Loading requests...</p> : (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? <p className="text-gray-500">No pending requests.</p> : pendingRequests.map((req, i) => (
            <RequestCard 
              key={i} 
              req={req} 
              onAccept={(id) => acceptRequest({ variables: { requestId: id }})} 
              onDecline={(id) => rejectRequest({ variables: { requestId: id }})} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ConnectionCard = ({ conn, onRemove }) => {
  const { data } = useQuery(GET_FULL_USER_BY_ID, {
    variables: { id: conn.userId },
    skip: !conn.userId
  });

  const userName = data?.getUserById?.name || "Loading...";

  return (
    <div className="flex items-center justify-between py-6 border-b border-gray-400">
      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 rounded-3xl border border-gray-400 flex items-center justify-center bg-gray-50">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h3 className="text-4xl font-playfair font-bold text-zinc-900">{userName}</h3>
      </div>
      <div className="flex items-center space-x-4">
      </div>
    </div>
  );
};

const ConnectionsView = () => {
  const { data, loading } = useQuery(GET_CONNECTIONS, { fetchPolicy: 'network-only' });
  const connections = data?.getConnections || [];

  return (
    <div className="max-w-4xl font-worksans">
      <h2 className="text-[44px] md:text-[56px] font-playfair font-extrabold italic text-zinc-900 leading-[1.1] mb-8">My Connections</h2>
      {loading ? <p>Loading connections...</p> : (
        <div className="space-y-0">
          {connections.length === 0 ? <p className="text-gray-500">You have no connections yet.</p> : connections.map((conn, idx) => (
             <ConnectionCard key={idx} conn={conn} />
          ))}
        </div>
      )}
    </div>
  );
};

const Matching = () => {
  const [currentView, setCurrentView] = useState('suggestions');
  const [user, setUser] = useState({ name: "User" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="overflow-hidden pr-6 md:pr-8 lg:pr-12 pl-0 pt-4 md:pt-6 pb-20 md:pb-28 bg-white min-h-screen relative">
      <div className="max-w-[1800px] mx-auto z-10 relative flex flex-col w-full h-full">
        <div className="w-full flex flex-col mb-10 pl-6 md:pl-8 lg:pl-12">
          <Header userName={user.name} />
          <div className="mt-4"><Breadcrumb /></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
          {/* Sidebar Area Desktop */}
          <div className="hidden lg:block w-[300px] shrink-0 sticky top-6">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
          </div>

          <div className="flex flex-col flex-1 w-full min-w-0 px-4 md:px-8">
            {/* Mobile View Switcher */}
            <div className="lg:hidden flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={() => setCurrentView('suggestions')}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium border ${currentView === 'suggestions' ? 'bg-[#1a1a1a] text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                Suggestions
              </button>
              <button 
                onClick={() => setCurrentView('requests')}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium border ${currentView === 'requests' ? 'bg-[#1a1a1a] text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                Requests
              </button>
              <button 
                onClick={() => setCurrentView('connections')}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium border ${currentView === 'connections' ? 'bg-[#1a1a1a] text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                Connections
              </button>
            </div>

            <main className="flex-1 overflow-y-auto">
              {currentView === 'suggestions' && <SuggestionsView />}
              {currentView === 'requests' && <RequestsView />}
              {currentView === 'connections' && <ConnectionsView />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matching;
