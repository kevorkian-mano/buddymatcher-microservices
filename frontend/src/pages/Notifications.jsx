import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Header, Breadcrumb, Sidebar } from '../components/dashboard';
import { GET_MY_NOTIFICATIONS } from '../graphql/queries/notificationQueries';
import { MARK_NOTIFICATION_READ } from '../graphql/mutations/notificationMutations';
import { JOIN_SESSION } from '../graphql/mutations/sessionMutations';
import { SEND_BUDDY_REQUEST, ACCEPT_BUDDY_REQUEST, REJECT_BUDDY_REQUEST } from '../graphql/mutations/matchingMutations';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TYPE_LABEL = {
  MATCH_FOUND:        'Study Buddy Match',
  SESSION_CREATED:    'New Study Session',
  SESSION_UPDATED:    'Session Updated',
  SESSION_JOINED:     'Session Update',
  BUDDY_REQUEST:      'Buddy Request',
  SESSION_INVITATION: 'Session Invitation',
};

const parseMeta = (n) => {
  try { return n.metadata ? JSON.parse(n.metadata) : {}; } catch { return {}; }
};

const timeAgo = (ts) => {
  const diff = Date.now() - parseInt(ts);
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
};

const NotificationRow = ({ n, onMarkRead, onAction, navigate }) => {
  const [busy, setBusy] = useState(null);
  const meta  = parseMeta(n);
  const label = TYPE_LABEL[n.type] || n.type;

  // Human-readable body text
  let title = n.content;
  if (n.type === 'MATCH_FOUND'        && meta.matchedUserName) title = `${meta.matchedUserName} — ${meta.score}% match`;
  if (n.type === 'SESSION_CREATED'    && meta.sessionTitle)    title = `New session: "${meta.sessionTitle}"`;
  if (n.type === 'SESSION_JOINED'     && meta.role === 'creator' && meta.joinerName) title = `${meta.joinerName} joined your session`;
  if (n.type === 'SESSION_JOINED'     && meta.role === 'joiner' && meta.sessionTitle) title = `You joined "${meta.sessionTitle}"`;
  if (n.type === 'BUDDY_REQUEST'      && meta.fromUserName)    title = `${meta.fromUserName} sent you a buddy request`;
  if (n.type === 'SESSION_INVITATION' && meta.fromUserName)    title = `${meta.fromUserName} invited you to "${meta.sessionTitle}"`;

  const sub = (() => {
    if (n.type === 'MATCH_FOUND' && meta.reason) return meta.reason;
    if (n.type === 'MATCH_FOUND' && meta.commonCourses?.length) return `Shared: ${[...meta.commonCourses, ...(meta.commonTopics || [])].join(', ')}`;
    return null;
  })();

  const run = async (type, vars, next) => {
    setBusy(type);
    try { await onAction(type, vars); } catch {}
    setBusy(next);
    onMarkRead(n.id);
  };

  return (
    <div className={`flex items-start justify-between gap-6 py-5 border-b border-gray-200 ${!n.read ? 'bg-white' : ''}`}>
      {/* Left: unread indicator + text */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <span className={`mt-2 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-zinc-900' : 'bg-transparent'}`} />
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-worksans mb-0.5">{label}</p>
          <h3 className={`font-playfair font-bold text-xl leading-tight ${n.read ? 'text-gray-400' : 'text-zinc-900'}`}>
            {title}
          </h3>
          {sub && <p className="text-sm text-gray-500 font-worksans mt-0.5 truncate">{sub}</p>}
          <p className="text-xs text-gray-400 font-worksans mt-1">{timeAgo(n.createdAt)}</p>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">

        {n.type === 'MATCH_FOUND' && (
          <>
            <button onClick={() => navigate(`/buddies/${meta.matchedUserId}`)}
              className="px-5 py-2 rounded-full text-sm font-medium border border-gray-300 text-zinc-700 hover:bg-gray-50 transition-colors font-worksans">
              View Profile
            </button>
            {!n.read && busy !== 'connected' && (
              <button
                disabled={busy === 'sendBuddy'}
                onClick={() => run('sendBuddy', { toUser: meta.matchedUserId }, 'connected')}
                className={`px-5 py-2 rounded-full text-sm font-medium font-worksans transition-colors
                  ${busy === 'sendBuddy' ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#1a1a1a] text-white hover:bg-black'}`}>
                {busy === 'sendBuddy' ? 'Connecting…' : '+ Connect'}
              </button>
            )}
            {busy === 'connected' && <span className="text-sm text-gray-400 font-worksans">Requested</span>}
          </>
        )}

        {n.type === 'SESSION_UPDATED' && meta.sessionId && (
          <button onClick={() => navigate(`/sessions/${meta.sessionId}`)}
            className="px-5 py-2 rounded-full text-sm font-medium bg-[#1a1a1a] text-white hover:bg-black font-worksans transition-colors">
            View Session
          </button>
        )}

        {n.type === 'SESSION_CREATED' && (
          <button onClick={() => navigate(`/sessions/${meta.sessionId}`)}
            className="px-5 py-2 rounded-full text-sm font-medium bg-[#1a1a1a] text-white hover:bg-black font-worksans transition-colors">
            View Session
          </button>
        )}

        {n.type === 'SESSION_JOINED' && meta.sessionId && (
          <button onClick={() => navigate(`/sessions/${meta.sessionId}`)}
            className="px-5 py-2 rounded-full text-sm font-medium bg-[#1a1a1a] text-white hover:bg-black font-worksans transition-colors">
            View Session
          </button>
        )}

        {n.type === 'BUDDY_REQUEST' && !n.read && !busy && meta.requestId && (
          <>
            <button onClick={() => run('acceptBuddy', { requestId: meta.requestId }, 'accepted')}
              className="px-5 py-2 rounded-full text-sm font-medium bg-[#1a1a1a] text-white hover:bg-black font-worksans transition-colors">
              Accept
            </button>
            <button onClick={() => run('rejectBuddy', { requestId: meta.requestId }, 'declined')}
              className="px-5 py-2 rounded-full text-sm font-medium border border-gray-300 text-zinc-700 hover:bg-gray-50 font-worksans transition-colors">
              Decline
            </button>
          </>
        )}
        {n.type === 'BUDDY_REQUEST' && busy && (
          <span className="text-sm text-gray-400 font-worksans capitalize">{busy}</span>
        )}

        {n.type === 'SESSION_INVITATION' && !n.read && !busy && meta.sessionId && (
          <>
            <button onClick={() => run('joinSession', { sessionId: meta.sessionId }, 'joined')}
              className="px-5 py-2 rounded-full text-sm font-medium bg-[#1a1a1a] text-white hover:bg-black font-worksans transition-colors">
              Join
            </button>
            <button onClick={() => onMarkRead(n.id)}
              className="px-5 py-2 rounded-full text-sm font-medium border border-gray-300 text-zinc-700 hover:bg-gray-50 font-worksans transition-colors">
              Decline
            </button>
          </>
        )}
        {n.type === 'SESSION_INVITATION' && busy && (
          <span className="text-sm text-gray-400 font-worksans capitalize">{busy}</span>
        )}

        {!n.read && !busy && !['MATCH_FOUND','SESSION_CREATED','SESSION_JOINED','BUDDY_REQUEST','SESSION_INVITATION'].includes(n.type) && (
          <button onClick={() => onMarkRead(n.id)}
            className="px-5 py-2 rounded-full text-sm font-medium border border-gray-300 text-zinc-700 hover:bg-gray-50 font-worksans transition-colors">
            Mark Read
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const Notifications = () => {
  const navigate = useNavigate();
  const [user, setUser]     = useState({ name: 'Alex' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const { data, loading, error, refetch } = useQuery(GET_MY_NOTIFICATIONS, { fetchPolicy: 'network-only' });
  const [markRead]    = useMutation(MARK_NOTIFICATION_READ, { onCompleted: () => refetch() });
  const [joinSession] = useMutation(JOIN_SESSION);
  const [sendBuddy]   = useMutation(SEND_BUDDY_REQUEST);
  const [acceptBuddy] = useMutation(ACCEPT_BUDDY_REQUEST);
  const [rejectBuddy] = useMutation(REJECT_BUDDY_REQUEST);

  if (loading) return <LoadingSpinner />;

  const all = data?.getMyNotifications || [];
  const unreadCount = all.filter(n => !n.read).length;
  const visible = filter === 'unread' ? all.filter(n => !n.read) : all;

  const handleAction = async (type, vars) => {
    if (type === 'sendBuddy')   return sendBuddy({ variables: vars });
    if (type === 'acceptBuddy') return acceptBuddy({ variables: vars });
    if (type === 'rejectBuddy') return rejectBuddy({ variables: vars });
    if (type === 'joinSession') return joinSession({ variables: vars });
  };

  return (
    <div className="overflow-hidden pr-6 md:pr-8 lg:pr-12 pl-0 pt-4 md:pt-6 pb-20 md:pb-28 bg-white min-h-screen relative">
      <div className="max-w-[1800px] mx-auto z-10 relative flex flex-col w-full h-full">

        <div className="w-full flex flex-col mb-10 pl-6 md:pl-8 lg:pl-12">
          <Header userName={user.name} />
          <div className="mt-4"><Breadcrumb /></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
          <div className="hidden lg:block w-[300px] shrink-0 sticky top-6">
            <Sidebar />
          </div>

          <div className="flex flex-col flex-1 w-full min-w-0 px-4 md:px-8">
            <div className="max-w-4xl font-worksans">

              {/* Heading */}
              <h2 className="text-[44px] md:text-[56px] font-playfair font-extrabold italic text-zinc-900 leading-[1.1] mb-2">
                Notifications
              </h2>
              <p className="text-zinc-600 mb-8 text-lg">
                {all.length} total &bull; {unreadCount} unread
              </p>

              {/* Filter tabs — same style as Matching page */}
              <div className="flex space-x-2 mb-6">
                {['all', 'unread'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium border transition-colors
                      ${filter === f
                        ? 'bg-[#1a1a1a] text-white border-black'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                    {f === 'all' ? 'All' : `Unread (${unreadCount})`}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t-2 border-black mb-2" />

              {error && <p className="text-red-500 py-4">Error loading notifications.</p>}

              {!error && visible.length === 0 && (
                <p className="text-gray-500 py-16 text-center font-worksans text-lg">
                  {filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
                </p>
              )}

              {/* Rows */}
              <div>
                {visible.map(n => (
                  <NotificationRow
                    key={n.id}
                    n={n}
                    onMarkRead={(id) => markRead({ variables: { id } })}
                    onAction={handleAction}
                    navigate={navigate}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
