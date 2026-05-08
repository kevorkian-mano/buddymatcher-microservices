import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AcademicProfile from './pages/AcademicProfile';
import StudyPreferences from './pages/StudyPreferences';
import BuddyMatcherLanding from './pages/BuddyMatcherLanding';
import FeaturesLanding from './pages/FeaturesLanding';
import HowItWorksLanding from './pages/HowItWorksLanding';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import Placeholder from './pages/Placeholder';
import EditProfile from './pages/EditProfile';
import Matching from './pages/Matching';
import Sessions from './pages/Sessions';
import SessionDetails from './pages/SessionDetails';
import BuddyDetails from './pages/BuddyDetails';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Auth Route Component (redirects logged-in users away from auth pages)
const AuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BuddyMatcherLanding />} />
        <Route path="/features" element={<FeaturesLanding />} />
        <Route path="/how-it-works" element={<HowItWorksLanding />} />
        
        {/* Public Auth Routes */}
        <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
        <Route path="/login" element={<AuthRoute><SignIn /></AuthRoute>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/matching" element={<ProtectedRoute><Matching /></ProtectedRoute>} />
        <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
        <Route path="/sessions/:sessionId" element={<ProtectedRoute><SessionDetails /></ProtectedRoute>} />
        <Route path="/buddies/:userId" element={<ProtectedRoute><BuddyDetails /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/academic-profile" element={<ProtectedRoute><AcademicProfile /></ProtectedRoute>} />
        <Route path="/study-preferences" element={<ProtectedRoute><StudyPreferences /></ProtectedRoute>} />
        
        <Route path="/features" element={<Placeholder title="Features" />} />
        <Route path="/how-it-works" element={<Placeholder title="How It Works" />} />
        <Route path="*" element={<Placeholder title="Not Found" />} />
      </Routes>
    </Router>
  );
}

export default App;