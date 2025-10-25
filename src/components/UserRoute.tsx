import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/contexts/AuthContext';

interface UserRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * UserRoute component for routes that require user role (not admin)
 * If user is not authenticated, redirects to auth page
 * If user is admin, redirects to admin panel
 */
export const UserRoute: React.FC<UserRouteProps> = ({
  children,
  redirectTo,
  fallback,
}) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to auth page
  if (!isAuthenticated) {
    const redirectPath = redirectTo || `/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`;
    return <Navigate to={redirectPath} replace />;
  }

  // If user is admin, redirect to admin panel
  if (isAdmin) {
    const redirectPath = redirectTo || '/admin';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
