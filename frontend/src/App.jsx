import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif', margin: '2rem' }}>
        <h1>Welcome to the Frontend Integration!</h1>
        <p>This is where we will integrate your Figma components.</p>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* We will add more routes here, e.g.: */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home Page Route</h2>
      <p>Apollo GraphQL Client and React Router are ready.</p>
    </div>
  );
}

export default App;