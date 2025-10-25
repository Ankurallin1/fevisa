import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('user' | 'admin')[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Route component that restricts access based on user roles
 */
export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  fallback,
  redirectTo,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!user?.role || !allowedRoles.includes(user.role)) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page. Required roles: {allowedRoles.join(', ')}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="btn-primary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Hook to check if user has required role
 */
export const useRoleCheck = (requiredRole: 'user' | 'admin') => {
  const { user, isAuthenticated } = useAuth();
  
  return {
    hasRole: isAuthenticated && user?.role === requiredRole,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    user,
    isAuthenticated,
  };
};

/**
 * Hook to get role-based navigation options
 */
export const useRoleNavigation = () => {
  const { user, isAuthenticated } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/auth';
    return user?.role === 'admin' ? '/admin' : '/dashboard';
  };

  const getNavigationItems = () => {
    if (!isAuthenticated) return [];

    const baseItems = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Bookings', path: '/bookings' },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { label: 'Admin Panel', path: '/admin' },
        { label: 'Users', path: '/admin/users' },
        { label: 'Settings', path: '/admin/settings' },
      ];
    }

    return [
      ...baseItems,
      { label: 'Profile', path: '/profile' },
    ];
  };

  return {
    getDefaultRoute,
    getNavigationItems,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
  };
};
