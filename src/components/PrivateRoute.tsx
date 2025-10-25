import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * PrivateRoute component for routes that require authentication
 * If user is not authenticated, they will be redirected to auth page
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  redirectTo,
  fallback,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
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

  return <>{children}</>;
};
