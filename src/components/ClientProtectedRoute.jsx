import React from 'react';
import { Navigate } from 'react-router-dom';

// Separate from ProtectedRoute.jsx (marketing-site Admin) — uses its own
// storage key so a company/employee session and an admin session can't
// collide or be confused with one another.
export default function ClientProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('client_token');
  if (!isAuthenticated) return <Navigate to="/portal/login" replace />;
  return children;
}
