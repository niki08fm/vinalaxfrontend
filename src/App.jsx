import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ToClientPortal from '/src/components/ToClientPortal.jsx';
import Home from '/src/pages/Home.jsx';
import Login from '/src/pages/Login.jsx';
import AdminDashboard from '/src/pages/AdminDashboard.jsx';
import ServiceDetails from '/src/pages/ServiceDetails.jsx';
import ProtectedRoute from '/src/components/ProtectedRoute.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Core Public Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* Dynamic Route for Individual Service Details */}
        <Route path="/services/:serviceId" element={<ServiceDetails />} />
        
        {/* Portal Entry Authentication */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Workspace Management Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Client portal lives at portal.vinalaxhrsolutions.com; old addresses forward there.
            Keep /:clientSlug LAST — fixed paths above always win over it. */}
        <Route path="/portal/login" element={<ToClientPortal />} />
        <Route path="/portal" element={<ToClientPortal />} />
        <Route path="/:clientSlug" element={<ToClientPortal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
