import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ModelDashboard from './pages/ModelDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ProfileDetails from './pages/ProfileDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ModelDashboard />} />
        <Route path="/client-portal" element={<ClientDashboard />} />
        <Route path="/profile" element={<ProfileDetails />} />
      </Routes>
    </Router>
  );
}

export default App;