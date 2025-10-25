import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/contexts/AuthContext';

/**
 * Component to handle redirects after authentication
 * Reads redirect parameter from URL and navigates accordingly
 */
export const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const redirectPath = searchParams.get('redirect');
    
    if (isAuthenticated) {
      // User is authenticated, redirect to intended destination or dashboard
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        // Default redirect based on user role
        const defaultPath = user?.role === 'admin' ? '/admin' : '/dashboard';
        navigate(defaultPath, { replace: true });
      }
    } else {
      // User is not authenticated, redirect to login
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, user, isLoading, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

/**
 * Hook to get redirect URL with current location
 */
export const useRedirectUrl = () => {
  const location = window.location;
  return `${location.pathname}${location.search}`;
};

/**
 * Hook to handle authentication redirects
 */
export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const redirectAfterLogin = (redirectPath?: string) => {
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    } else {
      const defaultPath = user?.role === 'admin' ? '/admin' : '/dashboard';
      navigate(defaultPath, { replace: true });
    }
  };

  const redirectToLogin = (currentPath?: string) => {
    const redirectUrl = currentPath || window.location.pathname + window.location.search;
    navigate(`/auth?redirect=${encodeURIComponent(redirectUrl)}`, { replace: true });
  };

  return {
    redirectAfterLogin,
    redirectToLogin,
    isAuthenticated,
    user,
  };
};
