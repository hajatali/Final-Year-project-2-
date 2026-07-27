import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // LocalStorage se check karein ke user logged in hai ya nahi
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  // Agar logged in hai to dashboard dikhao, warna Login page (/) par bhej do
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;