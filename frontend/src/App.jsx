import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import BuddyMatcherLanding from './pages/BuddyMatcherLanding';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BuddyMatcherLanding />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/features" element={<Placeholder title="Features" />} />
        <Route path="/how-it-works" element={<Placeholder title="How It Works" />} />
        <Route path="*" element={<Placeholder title="Not Found" />} />
      </Routes>
    </Router>
  );
}

export default App;