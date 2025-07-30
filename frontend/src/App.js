import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Forum from './components/Forum';
import MoodTracker from './components/MoodTracker';
import CrisisResources from './components/CrisisResources';
import Footer from './components/Footer';  // <-- import Footer here

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', position: 'relative', paddingBottom: '50px' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/mood" element={<MoodTracker />} />
            <Route path="/crisis-resources" element={<CrisisResources />} />
          </Routes>
        </Layout>
        <Footer />  {/* <-- Add Footer here */}
      </div>
    </Router>
  );
}

export default App;
