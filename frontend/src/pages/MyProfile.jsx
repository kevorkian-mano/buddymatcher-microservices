import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_FULL_PROFILE } from '../graphql/queries/profileQueries';
import { Header, Breadcrumb, Sidebar } from '../components/dashboard';
import { 
  ProfileHeader, 
  TabNavigation, 
  LearningStyle, 
  FreeDays, 
  StudyGoals 
} from '../components/profile';

function MyProfile() {
  const { data, loading, error } = useQuery(GET_MY_FULL_PROFILE, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const [localUser, setLocalUser] = React.useState({ name: "User" });

  React.useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setLocalUser(JSON.parse(savedUser));
    }
  }, []);

  const me = data?.me || localUser;
  const profile = data?.getMyProfile || {};

  return (
    <div className="overflow-hidden px-10 md:px-20 pt-10 md:pt-14 pb-20 md:pb-28 bg-white min-h-screen relative">
      {/* Decorative background element matching Dashboard */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/f6167e7425d570e9648e7389933bb7d6a2cd8117?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
        className="object-contain absolute top-[80px] -left-8 md:left-[5%] aspect-square w-[70px] opacity-20"
        alt="Dashboard decoration"
      />

      <div className="max-w-[1400px] mx-auto z-10 relative flex flex-col w-full h-full">
        {/* Header section spanning full width */}
        <div className="w-full flex flex-col mb-10">
          <Header userName={me.name} />
          <Breadcrumb />
        </div>        <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
          {/* Sidebar Area */}
          <div className="hidden lg:block w-[300px] shrink-0 sticky top-10">
            <Sidebar />
          </div>

          {/* Main Profile Content */}
          <div className="flex flex-col flex-1 w-full min-w-0">
            <main className="flex flex-col w-full max-w-[900px]">
              
              <ProfileHeader user={me} />

              <div className="w-full mt-4">
                <TabNavigation />
                <LearningStyle studyStyle={profile.preferences?.studyStyle} />
                <StudyGoals topics={profile.topics} />
                <FreeDays />
              </div>

            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;