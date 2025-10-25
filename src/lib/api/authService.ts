import apiClient from './client';
import type {
  SignupResponse,
  OtpVerificationResponse,
  AuthResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from '../types/site';

export const authService = {
  // Signup
  async signup(data: {
    name: string;
    email: string;
    countryCode: string;
    phone: string;
    password: string;
  }): Promise<SignupResponse> {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  // Resend OTP
  async resendOtp(email: string): Promise<{ success: boolean; message: string; data?: { email: string; otpSent: boolean } }> {
    const response = await apiClient.post('/auth/resend-otp', { email });
    return response.data;
  },

  // Verify OTP (for signup)
  async verifyOtp(data: {
    email: string;
    otp: string;
  }): Promise<OtpVerificationResponse> {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },

  // Login
  async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // Forgot Password
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Verify Forgot Password OTP
  async verifyForgotPasswordOtp(data: {
    email: string;
    otp: string;
  }): Promise<{ success: boolean; message: string; data?: { email: string } }> {
    const response = await apiClient.post('/auth/forgot-password/verify-otp', data);
    return response.data;
  },

  // Reset Password
  async resetPassword(data: {
    email: string;
    newPassword: string;
  }): Promise<ResetPasswordResponse> {
    const response = await apiClient.post('/auth/forgot-password/reset', data);
    return response.data;
  },

  // Utility functions
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  setAuthData(token: string, user: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};

// Booking Services
export const bookingService = {
  async getMyBookings(status?: string, page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    data: Array<{
      id: string;
      consultant: {
        _id: string;
        name: string;
        email: string;
      };
      date: string;
      startTime: string;
      endTime: string;
      duration: number;
      amount: number;
      currency: string;
      status: 'pending' | 'confirmed' | 'cancelled';
      paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
      notes?: string;
      isRescheduled: boolean;
      createdAt: string;
      canBeCancelled: boolean;
      canBeCancelledByUser: boolean;
      canBeRescheduled: boolean;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
  }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) {
      params.append('status', status);
    }
    const response = await apiClient.get(`/bookings/my-bookings?${params.toString()}`);
    return response.data;
  },

  async cancelBooking(bookingId: string, reason: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch(`/bookings/${bookingId}/cancel`, { reason });
    return response.data;
  },

  async rescheduleBooking(bookingId: string, data: {
    newDate: string;
    newStartTime: string;
    newEndTime: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch(`/bookings/${bookingId}/reschedule`, data);
    return response.data;
  },
};
