import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Aligned to match the 'token' key used by Login.jsx and AdminDashboard.jsx
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    // If the token is missing, reject entrance and push back to login
    return <Navigate to="/login" replace />;
  }

  // If validation passes, unlock access to the children sub-views
  return children;
}