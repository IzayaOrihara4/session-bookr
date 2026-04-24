import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('user' | 'client' | 'admin')[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles, 
  redirectPath = '/auth/login' 
}) => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ivory">
        <div className="animate-pulse text-espresso/40 font-serif text-xl">Loading session...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // If user has a role but not the authorized one, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
