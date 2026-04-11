import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Header, Breadcrumb, Sidebar } from '../components/dashboard';
import { GET_MY_NOTIFICATIONS } from '../graphql/queries/notificationQueries';
import { MARK_NOTIFICATION_READ } from '../graphql/mutations/notificationMutations';

const Notifications = () => {
  const [user, setUser] = useState({ name: "Alex" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const { data, loading, error, refetch } = useQuery(GET_MY_NOTIFICATIONS, { fetchPolicy: 'network-only' });
  const [markRead] = useMutation(MARK_NOTIFICATION_READ, {
    onCompleted: () => refetch()
  });

  const notificationsData = data?.getMyNotifications || [];

  const handleMarkAsRead = (id) => {
    markRead({ variables: { id } });
  };

  const getActionButtons = (notification) => {
    if (!notification.read) {
      return (
        <button 
          onClick={() => handleMarkAsRead(notification.id)}
          className="px-8 py-2.5 rounded-xl border transition-colors font-medium border-gray-400 text-gray-700 hover:bg-gray-50"
        >
          Mark as Read
        </button>
      );
    }
    return null;
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
            <main className="flex-1 font-worksans max-w-5xl w-full">
              
              <div className="mb-8">
                <h2 className="text-[44px] md:text-[56px] font-playfair font-extrabold italic text-zinc-900 leading-[1.1] mb-2 tracking-tight">
                  Notifications
                </h2>
                <p className="text-gray-600 text-lg font-medium">{notificationsData.length} total notifications</p>
              </div>

              {/* Notifications List */}
              <div className="space-y-4">
                {loading && <p className="text-gray-500">Loading notifications...</p>}
                {error && <p className="text-red-500">Error loading notifications.</p>}
                {!loading && !error && notificationsData.map((notification) => (
                  <div key={notification.id} className={`border ${notification.read ? 'border-gray-200 bg-gray-50' : 'border-gray-400 bg-white'} rounded-xl p-6 hover:shadow-sm transition-shadow`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-2xl ${notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>{notification.type}</h3>
                      <span className="text-gray-500 font-medium">{new Date(parseInt(notification.createdAt)).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <p className={`leading-relaxed pr-4 text-[17px] ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                        {notification.content}
                      </p>
                      
                      <div className="flex gap-3 shrink-0">
                        {getActionButtons(notification)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
