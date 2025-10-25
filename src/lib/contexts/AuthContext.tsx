import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../api/authService';
import { clearAllSessionData } from '../utils/sessionCleanup';
import type { User } from '../types/site';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isUser: boolean;
  getDefaultRoute: () => string;
  signup: (data: {
    name: string;
    email: string;
    countryCode: string;
    phone: string;
    password: string;
  }) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<any>;
  verifyForgotPasswordOtp: (email: string, otp: string) => Promise<any>;
  resetPassword: (email: string, newPassword: string) => Promise<any>;
  resendOtp: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Safe version of useAuth that returns null if not in provider
export const useAuthSafe = () => {
  const context = useContext(AuthContext);
  return context || null;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signup = async (data: {
    name: string;
    email: string;
    countryCode: string;
    phone: string;
    password: string;
  }) => {
    try {
      return await authService.signup(data);
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await authService.verifyOtp({ email, otp });
      if (response.success && response.data?.token && response.data?.user) {
        authService.setAuthData(response.data.token, response.data.user);
        setUser(response.data.user);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data?.token && response.data?.user) {
        authService.setAuthData(response.data.token, response.data.user);
        setUser(response.data.user);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear all data on logout
    clearAllSessionData();
    
    authService.logout();
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const verifyForgotPasswordOtp = async (email: string, otp: string) => {
    try {
      return await authService.verifyForgotPasswordOtp({ email, otp });
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      return await authService.resetPassword({ email, newPassword });
    } catch (error) {
      throw error;
    }
  };

  const resendOtp = async (email: string) => {
    try {
      return await authService.resendOtp(email);
    } catch (error) {
      throw error;
    }
  };

  // Role-based helpers
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';
  
  const getDefaultRoute = () => {
    if (!user) return '/auth';
    return user.role === 'admin' ? '/admin' : '/dashboard';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    isUser,
    getDefaultRoute,
    signup,
    verifyOtp,
    login,
    logout,
    forgotPassword,
    verifyForgotPasswordOtp,
    resetPassword,
    resendOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
