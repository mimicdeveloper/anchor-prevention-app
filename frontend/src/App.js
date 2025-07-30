import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Forum from './components/Forum';
import MoodTracker from './components/MoodTracker';
import CrisisResources from './components/CrisisResources';
import Footer from './components/Footer';

function App() {
  return (
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
      <Footer />
    </div>
  );
}

export default App;
