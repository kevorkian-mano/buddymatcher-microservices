import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AcademicProfile from './pages/AcademicProfile';
import StudyPreferences from './pages/StudyPreferences';
import BuddyMatcherLanding from './pages/BuddyMatcherLanding';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import Placeholder from './pages/Placeholder';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BuddyMatcherLanding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/academic-profile" element={<AcademicProfile />} />
        <Route path="/study-preferences" element={<StudyPreferences />} />
        <Route path="/features" element={<Placeholder title="Features" />} />
        <Route path="/how-it-works" element={<Placeholder title="How It Works" />} />
        <Route path="*" element={<Placeholder title="Not Found" />} />
      </Routes>
    </Router>
  );
}

export default App;