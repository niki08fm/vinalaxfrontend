import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '/src/pages/Home.jsx';
import Login from '/src/pages/Login.jsx';
import AdminDashboard from '/src/pages/AdminDashboard.jsx';
import ServiceDetails from '/src/pages/ServiceDetails.jsx';
import ProtectedRoute from '/src/components/ProtectedRoute.jsx';
import ClientLogin from '/src/pages/ClientLogin.jsx';
import ClientPortal from '/src/pages/ClientPortal.jsx';
import ClientProtectedRoute from '/src/components/ClientProtectedRoute.jsx';
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

        {/* Client Portal — company/employee logins, separate from the Admin above */}
        <Route path="/portal/login" element={<ClientLogin />} />
        <Route
          path="/portal"
          element={
            <ClientProtectedRoute>
              <ClientPortal />
            </ClientProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
