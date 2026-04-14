import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_MY_FULL_PROFILE } from '../graphql/queries/profileQueries';
import { Header, Breadcrumb, Sidebar } from '../components/dashboard';
import { 
  ProfileHeader, 
  TabNavigation, 
  StudyPreferencesTab,
  PersonalDetailsTab,
  RecentActivityTab,
  AvailabilityTab
} from '../components/profile';
import LoadingSpinner from '../components/common/LoadingSpinner';

function MyProfile() {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_MY_FULL_PROFILE, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const [localUser, setLocalUser] = useState({ name: "User" });
  const [activeTab, setActiveTab] = useState('study preferences');

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setLocalUser(JSON.parse(savedUser));
    }
  }, []);

  if (loading) return <LoadingSpinner />;

  const me = data?.me || localUser;
  const profile = data?.getMyProfile || {};

  return (
    <div className="overflow-hidden pr-6 md:pr-8 lg:pr-12 pl-0 pt-4 md:pt-6 pb-20 md:pb-28 bg-white min-h-screen relative w-full">

      <div className="w-full max-w-none mx-0 z-10 relative flex flex-col h-full">
        {/* Header section spanning full width */}
        <div className="w-full flex flex-col mb-10 pl-6 md:pl-8 lg:pl-12">
          <Header userName={me.name} />
          <Breadcrumb />
        </div>

        <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
          {/* Sidebar Area */}
          <div className="hidden lg:block w-[300px] shrink-0 sticky top-4">
            <Sidebar />
          </div>

          {/* Main Profile Content */}
          <div className="flex flex-col flex-1 w-full min-w-0 pr-4">
            <main className="flex flex-col w-full max-w-[900px]">
              
              <ProfileHeader user={me} />

              <div className="w-full mt-4">
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
                
                {activeTab === 'study preferences' && (
                  <StudyPreferencesTab profile={profile} />
                )}
                
                {activeTab === 'personal details' && (
                  <PersonalDetailsTab user={me} profile={profile} />
                )}

                {activeTab === 'availability' && (
                  <AvailabilityTab />
                )}

                {activeTab === 'recent activity' && (
                  <RecentActivityTab />
                )}
              </div>

              {/* Edit Profile Button at End */}
              <div className="w-full mt-10 mb-8 flex justify-end">
                <button 
                  onClick={() => navigate('/edit-profile')}
                  className="flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-xl text-xl font-worksans font-medium hover:bg-zinc-800 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;