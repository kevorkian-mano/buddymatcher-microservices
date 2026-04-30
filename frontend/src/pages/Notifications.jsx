import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Header, Breadcrumb, Sidebar } from '../components/dashboard';
import { GET_MY_NOTIFICATIONS } from '../graphql/queries/notificationQueries';
import { MARK_NOTIFICATION_READ } from '../graphql/mutations/notificationMutations';
import { JOIN_SESSION } from '../graphql/mutations/sessionMutations';
import { SEND_BUDDY_REQUEST, ACCEPT_BUDDY_REQUEST, REJECT_BUDDY_REQUEST } from '../graphql/mutations/matchingMutations';
import LoadingSpinner from '../components/common/LoadingSpinner';

// ─── Type labels & icon colors ───────────────────────────────────────────────
const TYPE_CONFIG = {
  MATCH_FOUND:       { label: 'Study Buddy Match',     accent: 'border-l-violet-500',  badge: 'bg-violet-100 text-violet-700'  },
  SESSION_CREATED:   { label: 'New Study Session',     accent: 'border-l-blue-500',    badge: 'bg-blue-100 text-blue-700'      },
  SESSION_JOINED:    { label: 'Session Update',        accent: 'border-l-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  BUDDY_REQUEST:     { label: 'Buddy Request',         accent: 'border-l-amber-500',   badge: 'bg-amber-100 text-amber-700'    },
  SESSION_INVITATION:{ label: 'Session Invitation',   accent: 'border-l-rose-500',    badge: 'bg-rose-100 text-rose-700'      },
};

// ─── Button helpers (reuse existing project button styles) ────────────────────
const BtnPrimary   = ({ onClick, children, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    className="px-5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-white font-medium text-sm hover:bg-zinc-700 transition-colors disabled:opacity-50">
    {children}
  </button>
);
const BtnSecondary = ({ onClick, children }) => (
  <button onClick={onClick}
    className="px-5 py-2 rounded-xl border border-zinc-400 text-zinc-700 font-medium text-sm hover:bg-zinc-100 transition-colors">
    {children}
  </button>
);
const BtnGreen  = ({ onClick, children, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    className="px-5 py-2 rounded-xl border border-green-500 bg-green-50 text-green-700 font-medium text-sm hover:bg-green-100 transition-colors disabled:opacity-50">
    {children}
  </button>
);
const BtnRed    = ({ onClick, children }) => (
  <button onClick={onClick}
    className="px-5 py-2 rounded-xl border border-red-500 bg-red-50 text-red-700 font-medium text-sm hover:bg-red-100 transition-colors">
    {children}
  </button>
);
const BtnIndigo = ({ onClick, children }) => (
  <button onClick={onClick}
    className="px-5 py-2 rounded-xl border border-indigo-500 bg-indigo-50 text-indigo-700 font-medium text-sm hover:bg-indigo-100 transition-colors">
    {children}
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────────
const Notifications = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Alex' });
  const [actionStates, setActionStates] = useState({}); // per-notif loading / done state

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const { data, loading, error, refetch } = useQuery(GET_MY_NOTIFICATIONS, { fetchPolicy: 'network-only' });
  const [markRead]       = useMutation(MARK_NOTIFICATION_READ, { onCompleted: () => refetch() });
  const [joinSession]    = useMutation(JOIN_SESSION);
  const [sendBuddy]      = useMutation(SEND_BUDDY_REQUEST);
  const [acceptBuddy]    = useMutation(ACCEPT_BUDDY_REQUEST);
  const [rejectBuddy]    = useMutation(REJECT_BUDDY_REQUEST);

  if (loading) return <LoadingSpinner />;

  const notifications = data?.getMyNotifications || [];
  const unreadCount   = notifications.filter(n => !n.read).length;

  // Parse metadata JSON string safely
  const parseMeta = (n) => {
    try { return n.metadata ? JSON.parse(n.metadata) : {}; }
    catch { return {}; }
  };

  const doMarkRead = (id) => markRead({ variables: { id } });

  const setAction = (id, state) => setActionStates(prev => ({ ...prev, [id]: state }));

  // ─── Per-type action buttons ────────────────────────────────────────────────

  // 1. MATCH_FOUND
  const MatchFoundActions = ({ n, meta }) => {
    const done = actionStates[n.id];
    return (
      <div className="flex flex-wrap gap-2 shrink-0">
        <BtnIndigo onClick={() => navigate(`/buddies/${meta.matchedUserId}`)}>
          View Profile
        </BtnIndigo>
        {!n.read && !done && (
          <BtnGreen
            disabled={actionStates[n.id] === 'connecting'}
            onClick={async () => {
              setAction(n.id, 'connecting');
              try { await sendBuddy({ variables: { toUser: meta.matchedUserId } }); }
              catch {}
              setAction(n.id, 'connected');
              doMarkRead(n.id);
            }}
          >
            {actionStates[n.id] === 'connecting' ? 'Connecting…' : 'Connect'}
          </BtnGreen>
        )}
        {!n.read && (
          <BtnSecondary onClick={() => doMarkRead(n.id)}>Mark as Read</BtnSecondary>
        )}
      </div>
    );
  };

  // 2. SESSION_CREATED
  const SessionCreatedActions = ({ n, meta }) => (
    <div className="flex flex-wrap gap-2 shrink-0">
      <BtnPrimary onClick={() => navigate(`/sessions/${meta.sessionId}`)}>View Session</BtnPrimary>
      {meta.creatorId && (
        <BtnIndigo onClick={() => navigate(`/buddies/${meta.creatorId}`)}>View Creator</BtnIndigo>
      )}
      {!n.read && (
        <BtnSecondary onClick={() => doMarkRead(n.id)}>Mark as Read</BtnSecondary>
      )}
    </div>
  );

  // 3. SESSION_JOINED
  const SessionJoinedActions = ({ n, meta }) => (
    <div className="flex flex-wrap gap-2 shrink-0">
      {meta.sessionId && (
        <BtnPrimary onClick={() => navigate(`/sessions/${meta.sessionId}`)}>View Session</BtnPrimary>
      )}
      {!n.read && (
        <BtnSecondary onClick={() => doMarkRead(n.id)}>Mark as Read</BtnSecondary>
      )}
    </div>
  );

  // 4. BUDDY_REQUEST
  const BuddyRequestActions = ({ n, meta }) => {
    const done = actionStates[n.id];
    return (
      <div className="flex flex-wrap gap-2 shrink-0">
        {meta.fromUserId && (
          <BtnIndigo onClick={() => navigate(`/buddies/${meta.fromUserId}`)}>
            View Profile
          </BtnIndigo>
        )}
        {!n.read && !done && meta.requestId && (
          <>
            <BtnGreen
              disabled={actionStates[n.id] === 'accepting'}
              onClick={async () => {
                setAction(n.id, 'accepting');
                try { await acceptBuddy({ variables: { requestId: meta.requestId } }); }
                catch {}
                setAction(n.id, 'accepted');
                doMarkRead(n.id);
              }}
            >
              {actionStates[n.id] === 'accepting' ? 'Accepting…' : 'Accept'}
            </BtnGreen>
            <BtnRed
              onClick={async () => {
                setAction(n.id, 'rejecting');
                try { await rejectBuddy({ variables: { requestId: meta.requestId } }); }
                catch {}
                setAction(n.id, 'rejected');
                doMarkRead(n.id);
              }}
            >
              Reject
            </BtnRed>
          </>
        )}
        {!n.read && !meta.requestId && (
          <BtnSecondary onClick={() => doMarkRead(n.id)}>Mark as Read</BtnSecondary>
        )}
      </div>
    );
  };

  // 5. SESSION_INVITATION
  const SessionInvitationActions = ({ n, meta }) => {
    const done = actionStates[n.id];
    return (
      <div className="flex flex-wrap gap-2 shrink-0">
        {meta.fromUserId && (
          <BtnIndigo onClick={() => navigate(`/buddies/${meta.fromUserId}`)}>View Creator</BtnIndigo>
        )}
        {meta.sessionId && (
          <BtnPrimary onClick={() => navigate(`/sessions/${meta.sessionId}`)}>View Session</BtnPrimary>
        )}
        {!n.read && !done && meta.sessionId && (
          <>
            <BtnGreen
              disabled={actionStates[n.id] === 'joining'}
              onClick={async () => {
                setAction(n.id, 'joining');
                try { await joinSession({ variables: { sessionId: meta.sessionId } }); }
                catch {}
                setAction(n.id, 'joined');
                doMarkRead(n.id);
              }}
            >
              {actionStates[n.id] === 'joining' ? 'Joining…' : 'Join'}
            </BtnGreen>
            <BtnRed onClick={() => doMarkRead(n.id)}>Decline</BtnRed>
          </>
        )}
        {!n.read && !meta.sessionId && (
          <BtnSecondary onClick={() => doMarkRead(n.id)}>Mark as Read</BtnSecondary>
        )}
      </div>
    );
  };

  // ─── Render a single notification card ──────────────────────────────────────
  const renderCard = (n) => {
    const meta   = parseMeta(n);
    const config = TYPE_CONFIG[n.type] || { label: n.type, accent: 'border-l-gray-400', badge: 'bg-gray-100 text-gray-700' };
    const ts     = new Date(parseInt(n.createdAt)).toLocaleString();

    // Build the rich description per type
    let description = n.content;
    if (n.type === 'MATCH_FOUND' && meta.matchedUserName) {
      description = (
        <span>
          <span className="font-semibold text-zinc-800">{meta.matchedUserName}</span>
          {' '}is a {meta.score}% match with you.{' '}
          <span className="text-zinc-500 italic">{meta.reason}</span>
          {meta.commonCourses?.length > 0 && (
            <span className="ml-1">Shared courses: <span className="font-medium">{meta.commonCourses.join(', ')}</span>.</span>
          )}
          {meta.commonTopics?.length > 0 && (
            <span className="ml-1">Shared topics: <span className="font-medium">{meta.commonTopics.join(', ')}</span>.</span>
          )}
        </span>
      );
    } else if (n.type === 'SESSION_CREATED' && meta.sessionTitle) {
      description = (
        <span>
          <span className="font-semibold text-zinc-800">{meta.creatorName || 'Someone'}</span>
          {' '}created a new session: <span className="font-semibold text-zinc-800">"{meta.sessionTitle}"</span>.
        </span>
      );
    } else if (n.type === 'SESSION_JOINED') {
      if (meta.role === 'creator' && meta.joinerName) {
        description = (
          <span>
            <span className="font-semibold text-zinc-800">{meta.joinerName}</span>
            {' '}joined your session: <span className="font-semibold text-zinc-800">"{meta.sessionTitle}"</span>.
          </span>
        );
      } else if (meta.sessionTitle) {
        description = (
          <span>
            You joined: <span className="font-semibold text-zinc-800">"{meta.sessionTitle}"</span>.
          </span>
        );
      }
    } else if (n.type === 'BUDDY_REQUEST' && meta.fromUserName) {
      description = (
        <span>
          <span className="font-semibold text-zinc-800">{meta.fromUserName}</span>
          {' '}sent you a buddy request!
        </span>
      );
    } else if (n.type === 'SESSION_INVITATION' && meta.fromUserName) {
      description = (
        <span>
          <span className="font-semibold text-zinc-800">{meta.fromUserName}</span>
          {' '}invited you to join{' '}
          <span className="font-semibold text-zinc-800">"{meta.sessionTitle}"</span>.
        </span>
      );
    }

    const renderActions = () => {
      if (n.type === 'MATCH_FOUND')        return <MatchFoundActions n={n} meta={meta} />;
      if (n.type === 'SESSION_CREATED')    return <SessionCreatedActions n={n} meta={meta} />;
      if (n.type === 'SESSION_JOINED')     return <SessionJoinedActions n={n} meta={meta} />;
      if (n.type === 'BUDDY_REQUEST')      return <BuddyRequestActions n={n} meta={meta} />;
      if (n.type === 'SESSION_INVITATION') return <SessionInvitationActions n={n} meta={meta} />;
      // Fallback generic mark-as-read
      if (!n.read) return <BtnSecondary onClick={() => doMarkRead(n.id)}>Mark as Read</BtnSecondary>;
      return null;
    };

    return (
      <div
        key={n.id}
        className={`border-l-4 ${config.accent} ${n.read ? 'border border-gray-200 bg-gray-50' : 'border border-gray-300 bg-white'} rounded-xl p-5 hover:shadow-sm transition-shadow`}
      >
        {/* Top row: type badge + timestamp */}
        <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
          <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${config.badge}`}>
            {config.label}
          </span>
          <span className="text-gray-400 text-sm">{ts}</span>
        </div>

        {/* Body + actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className={`leading-relaxed text-[15px] sm:pr-4 ${n.read ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
          <div className="flex gap-2 shrink-0 flex-wrap">
            {renderActions()}
          </div>
        </div>
      </div>
    );
  };

  // ─── Page layout ─────────────────────────────────────────────────────────────
  return (
    <div className="overflow-hidden pr-6 md:pr-8 lg:pr-12 pl-0 pt-4 md:pt-6 pb-20 md:pb-28 bg-white min-h-screen relative">
      <div className="max-w-[1800px] mx-auto z-10 relative flex flex-col w-full h-full">

        {/* Header */}
        <div className="w-full flex flex-col mb-10 pl-6 md:pl-8 lg:pl-12">
          <Header userName={user.name} />
          <div className="mt-4"><Breadcrumb /></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
          {/* Sidebar */}
          <div className="hidden lg:block w-[300px] shrink-0 sticky top-6">
            <Sidebar />
          </div>

          {/* Main */}
          <div className="flex flex-col flex-1 w-full min-w-0 px-4 md:px-8">
            <main className="flex-1 font-worksans max-w-5xl w-full">

              <div className="mb-8">
                <h2 className="text-[44px] md:text-[56px] font-playfair font-extrabold italic text-zinc-900 leading-[1.1] mb-2 tracking-tight">
                  Notifications
                </h2>
                <p className="text-gray-600 text-lg font-medium">
                  {notifications.length} total &bull; {unreadCount} unread
                </p>
              </div>

              {error && <p className="text-red-500">Error loading notifications.</p>}

              {!error && notifications.length === 0 && (
                <div className="text-center py-20 text-gray-400 font-worksans">
                  <p className="text-2xl mb-2">🔔</p>
                  <p className="text-lg">No notifications yet.</p>
                </div>
              )}

              <div className="space-y-4">
                {notifications.map(renderCard)}
              </div>

            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
