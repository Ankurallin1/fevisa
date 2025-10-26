import apiClient from './client';
import { mockAdapter } from './mockAdapter';
import type { Service, AvailabilityResponse, CreateBookingRequest, CreateBookingResponse, PricingResponse, CreatePaymentOrderResponse, PaymentCaptureResponse, BookingApiResponse } from '../types/site';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// API functions that route to mock adapter in dev, real API in production
export const api = {
  // Services API (for development only - not in Postman collection)
  async listServices(): Promise<Service[]> {
    if (isDevelopment) {
      return mockAdapter.listServices();
    }
    // TODO: Replace with real API call
    const response = await apiClient.get('/services');
    return response.data;
  },

  async getService(slug: string): Promise<Service | null> {
    if (isDevelopment) {
      return mockAdapter.getService(slug);
    }
    // TODO: Replace with real API call
    try {
      const response = await apiClient.get(`/services/${slug}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Pricing API (matches Postman: GET /public/pricing)
  async getPricing(): Promise<PricingResponse> {
    console.log('API: getPricing called');
    
    try {
      // Always use real API for pricing
      const response = await apiClient.get('/public/pricing');
      console.log('API: Real pricing response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error fetching pricing:', error);
      
      // Throw error instead of returning mock data
      throw error;
    }
  },

  // Availability API (matches Postman: GET /bookings/availability/{date})
  async checkAvailability(date: string): Promise<AvailabilityResponse> {
    console.log('API: checkAvailability called with date:', date);
    
    try {
      // Always use real API for availability checking
      const response = await apiClient.get(`/bookings/availability/${date}`);
      console.log('API: Response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error fetching availability:', error);
      
      // Re-throw the error to be handled by the component
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch availability');
    }
  },

  // Create Booking API (matches Postman: POST /bookings/create)
  async createBooking(payload: CreateBookingRequest): Promise<CreateBookingResponse> {
    console.log('API: createBooking called with payload:', payload);
    console.log('API: isDevelopment:', isDevelopment);
    
    // Always use real API for booking creation
    console.log('API: Making real API call to /bookings/create');
    try {
      const response = await apiClient.post('/bookings/create', payload);
      console.log('API: Real API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Booking creation failed:', error);
      // Throw error instead of returning mock data
      throw error;
    }
  },

  // Get Booking API (matches Postman: GET /bookings/{bookingId})
  async getBooking(bookingId: string): Promise<BookingApiResponse | null> {
    console.log('API: getBooking called with bookingId:', bookingId);
    
    try {
      // Always use real API for booking details
      const response = await apiClient.get(`/bookings/${bookingId}`);
      console.log('API: Real API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error fetching booking:', error);
      
      // Return null instead of falling back to mock data
      return null;
    }
  },

  // Create Payment Order API (matches Postman: POST /bookings/{bookingId}/payment/create)
  async createPaymentOrder(bookingId: string): Promise<CreatePaymentOrderResponse> {
    console.log('API: Creating payment order for booking:', bookingId);
    const response = await apiClient.post(`/bookings/${bookingId}/payment/create`);
    return response.data;
  },

  // Capture Payment API (matches Postman: POST /bookings/payment/capture/{orderId})
  async capturePayment(orderId: string): Promise<PaymentCaptureResponse> {
    console.log('API: Capturing payment for order:', orderId);
    const response = await apiClient.post(`/bookings/payment/capture/${orderId}`);
    return response.data;
  },

  // Reschedule Booking API (matches Postman: PATCH /bookings/{bookingId}/reschedule)
  async rescheduleBooking(bookingId: string, rescheduleData: {
    newDate: string;
    newStartTime: string;
    newEndTime: string;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    console.log('API: Rescheduling booking:', bookingId, rescheduleData);
    try {
      const response = await apiClient.patch(`/bookings/${bookingId}/reschedule`, rescheduleData);
      console.log('API: Reschedule response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Reschedule error:', error);
      throw error;
    }
  },

  // Cancel Booking with Refund API (matches Postman: PATCH /bookings/{bookingId}/cancel-with-refund)
  async cancelBookingWithRefund(bookingId: string, reason: string): Promise<{ success: boolean; message: string; data?: any }> {
    console.log('API: Cancelling booking with refund:', bookingId, reason);
    try {
      const response = await apiClient.patch(`/bookings/${bookingId}/cancel-with-refund`, { reason });
      console.log('API: Cancel with refund response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Cancel with refund error:', error);
      throw error;
    }
  },

  // Admin APIs
  // Get All Holidays API (matches Postman: GET /admin/holidays)
  async getAllHolidays(): Promise<{
    success: boolean;
    data: Array<{
      id: string;
      date: string;
      reason: string;
      isRecurring: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
  }> {
    console.log('API: Getting all holidays');
    try {
      const response = await apiClient.get('/admin/holidays');
      console.log('API: Holidays response:', response.data);
      
      // Transform the response to match expected format
      const apiData = response.data;
      const transformedData = {
        success: apiData.success || true,
        data: apiData.data?.holidays || []
      };
      
      return transformedData;
    } catch (error: any) {
      console.error('API: Error fetching holidays:', error);
      throw error;
    }
  },

  // Add Holiday API (matches Postman: POST /admin/holidays/all)
  async addHoliday(holidayData: {
    date: string;
    reason: string;
    isRecurring: boolean;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    console.log('API: Adding holiday:', holidayData);
    try {
      const response = await apiClient.post('/admin/holidays/all', holidayData);
      console.log('API: Add holiday response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error adding holiday:', error);
      throw error;
    }
  },

  // Update Holiday API (matches Postman: PUT /admin/holidays/{holidayId})
  async updateHoliday(holidayId: string, holidayData: {
    date: string;
    reason: string;
    isRecurring: boolean;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    console.log('API: Updating holiday:', holidayId, holidayData);
    try {
      const response = await apiClient.put(`/admin/holidays/${holidayId}`, holidayData);
      console.log('API: Update holiday response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error updating holiday:', error);
      throw error;
    }
  },

  // Delete Holiday API (matches Postman: DELETE /admin/holidays/{holidayId})
  async deleteHoliday(holidayId: string): Promise<{ success: boolean; message: string }> {
    console.log('API: Deleting holiday:', holidayId);
    try {
      const response = await apiClient.delete(`/admin/holidays/${holidayId}`);
      console.log('API: Delete holiday response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error deleting holiday:', error);
      throw error;
    }
  },

  // Get All Bookings API (matches Postman: GET /admin/bookings)
  async getAllBookings(
    page: number = 1, 
    limit: number = 10, 
    status?: string, 
    paymentStatus?: string, 
    dateFrom?: string, 
    dateTo?: string
  ): Promise<{
    success: boolean;
    data: Array<{
      id: string;
      user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
      };
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
      status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled' | 'payment_failed';
      paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
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
    console.log('API: Getting all bookings with pagination:', { page, limit, status, paymentStatus, dateFrom, dateTo });
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (status) {
        params.append('status', status);
      }
      if (paymentStatus) {
        params.append('paymentStatus', paymentStatus);
      }
      if (dateFrom) {
        params.append('dateFrom', dateFrom);
      }
      if (dateTo) {
        params.append('dateTo', dateTo);
      }
      const response = await apiClient.get(`/admin/allbookings?${params.toString()}`);
      console.log('API: All bookings response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error fetching all bookings:', error);
      throw error;
    }
  },

  // Get All Users API (matches Postman: GET /admin/users)
  async getAllUsers(page: number = 1, limit: number = 10, search?: string): Promise<{
    success: boolean;
    data: Array<{
      _id: string;
      name: string;
      email: string;
      phone: string;
      countryCode?: string;
      role: 'user' | 'admin';
      isVerified: boolean;
      createdAt: string;
      updatedAt: string;
      lastLogin?: string;
      totalBookings?: number;
      activeBookings?: number;
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
    console.log('API: Getting all users with pagination:', { page, limit, search });
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) {
        params.append('search', search);
      }
      const response = await apiClient.get(`/admin/users?${params.toString()}`);
      console.log('API: All users response:', response.data);
      
      // Transform the response to match expected format
      const apiData = response.data;
      const transformedData = {
        success: true,
        data: apiData.users || [],
        pagination: {
          currentPage: apiData.page || 1,
          totalPages: apiData.totalPages || 1,
          totalItems: apiData.total || 0,
          itemsPerPage: apiData.limit || 10,
          hasNextPage: (apiData.page || 1) < (apiData.totalPages || 1),
          hasPrevPage: (apiData.page || 1) > 1,
          nextPage: (apiData.page || 1) < (apiData.totalPages || 1) ? (apiData.page || 1) + 1 : null,
          prevPage: (apiData.page || 1) > 1 ? (apiData.page || 1) - 1 : null,
        }
      };
      
      return transformedData;
    } catch (error: any) {
      console.error('API: Error fetching all users:', error);
      throw error;
    }
  },

  // Hold Slot API (for development)
  async holdSlot(slotId: string): Promise<{ success: boolean; message: string }> {
    if (isDevelopment) {
      return mockAdapter.holdSlot(slotId);
    }
    // TODO: Replace with real API call
    const response = await apiClient.post(`/slots/${slotId}/hold`);
    return response.data;
  },

  // Release Slot API (for development)
  async releaseSlot(slotId: string): Promise<{ success: boolean; message: string }> {
    if (isDevelopment) {
      return mockAdapter.releaseSlot(slotId);
    }
    // TODO: Replace with real API call
    const response = await apiClient.post(`/slots/${slotId}/release`);
    return response.data;
  },

  // Verify Payment API (for development)
  async verifyPayment(paymentId: string): Promise<{ success: boolean; message: string }> {
    if (isDevelopment) {
      return mockAdapter.verifyPayment(paymentId);
    }
    // TODO: Replace with real API call
    const response = await apiClient.post(`/payments/${paymentId}/verify`);
    return response.data;
  },
};