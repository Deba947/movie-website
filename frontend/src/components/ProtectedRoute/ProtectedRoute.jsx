import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MovieContext } from '../../context/MovieContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token, user, authLoading } = useContext(MovieContext);

  // WAIT until token is restored
  if (authLoading) {
    return null; // or spinner
  }

  // Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  //  Admin only
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
