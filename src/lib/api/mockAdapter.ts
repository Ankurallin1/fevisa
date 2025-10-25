import type { Service, AvailabilityResponse, CreateBookingRequest, CreateBookingResponse, PricingResponse, CreatePaymentOrderResponse, PaymentCaptureResponse, BookingApiResponse } from '../types/site';

// Mock data for development
const mockServices: Service[] = [
  {
    id: 'student-visa',
    slug: 'student-visa',
    name: 'Student Visa',
    shortDesc: 'Comprehensive support for international students',
    longDesc: 'Complete assistance for student visa applications including university selection, documentation, interview preparation, and post-approval support.',
    inclusions: ['University shortlisting', 'Document preparation', 'Application submission', 'Interview preparation', 'Post-approval guidance'],
    exclusions: ['University application fees', 'Visa application fees', 'Medical examination costs'],
    supportedCountries: ['Australia'],
    faqs: [
      { q: 'How long does the student visa process take?', a: 'Typically 2-4 weeks for most countries, but can vary based on the destination and time of year.' },
      { q: 'What documents are required?', a: 'Academic transcripts, language test scores, financial documents, passport, and university acceptance letter.' }
    ],
    startingPrice: 100,
    durationMin: 30,
    timelines: 'Processing typically takes 2-4 weeks for most visa applications, depending on the type and complexity.',
    documents: [
      'Valid passport with at least 6 months validity',
      'Completed visa application form',
      'Recent passport-sized photographs',
      'Proof of financial capacity',
      'Travel itinerary and accommodation details'
    ]
  },
];

// In-memory storage for development

export const mockAdapter = {
  // Services API (for development only - not in Postman collection)
  async listServices(): Promise<Service[]> {
    console.log('Mock: Fetching services');
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockServices), 500);
    });
  },

  async getService(slug: string): Promise<Service | null> {
    console.log('Mock: Fetching service', slug);
    return new Promise((resolve) => {
      setTimeout(() => {
        const service = mockServices.find(s => s.slug === slug);
        resolve(service || null);
      }, 300);
    });
  },

  // Pricing API (matches Postman: GET /public/pricing)
  async getPricing(): Promise<PricingResponse> {
    console.log('Mock: Fetching pricing');
    return new Promise((resolve) => {
      setTimeout(() => {
        const response: PricingResponse = {
          success: true,
          message: 'Pricing loaded successfully',
          data: {
            amount: "100",
            currency: "AUD",
            country: "Australia",
            duration: 30
          }
        };
        resolve(response);
      }, 300);
    });
  },

  // Availability API (matches Postman: GET /bookings/availability/{date})
  async checkAvailability(date: string): Promise<AvailabilityResponse> {
    console.log('Mock: Checking availability for date', date);
    return new Promise((resolve) => {
      setTimeout(() => {
        const response: AvailabilityResponse = {
          success: true,
          message: 'Availability checked successfully',
          data: {
            available: true,
            consultant: {
              id: 'consultant-1',
              name: 'Dr. Sarah Johnson',
              email: 'sarah.johnson@consultation-visa.com'
            },
            date,
            timezone: 'Australia/Sydney',
            slots: [
              { startTime: '09:00', endTime: '10:00', startDateTime: `${date}T09:00:00`, endDateTime: `${date}T10:00:00`, available: true },
              { startTime: '10:00', endTime: '11:00', startDateTime: `${date}T10:00:00`, endDateTime: `${date}T11:00:00`, available: true },
              { startTime: '14:00', endTime: '15:00', startDateTime: `${date}T14:00:00`, endDateTime: `${date}T15:00:00`, available: true },
              { startTime: '15:00', endTime: '16:00', startDateTime: `${date}T15:00:00`, endDateTime: `${date}T16:00:00`, available: false },
            ]
          }
        };
        resolve(response);
      }, 300);
    });
  },

  // Create Booking API (matches Postman: POST /bookings/create)
  async createBooking(payload: CreateBookingRequest): Promise<CreateBookingResponse> {
    console.log('Mock: Creating booking', payload);
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookingId = `booking-${Date.now()}`;
        
        const response: CreateBookingResponse = {
          success: true,
          message: 'Booking created successfully',
          data: {
            id: bookingId,
            userId: 'user-123',
            consultantId: 'consultant-1',
            date: payload.date,
            startTime: payload.startTime,
            endTime: payload.endTime,
            duration: payload.duration,
            amount: 100,
            currency: 'AUD',
            status: 'pending',
            paymentStatus: 'pending',
            notes: payload.notes || '',
            createdAt: new Date().toISOString()
          }
        };
        
        resolve(response);
      }, 500);
    });
  },

  // Get Booking API (matches Postman: GET /bookings/{bookingId})
  async getBooking(bookingId: string): Promise<BookingApiResponse | null> {
    console.log('Mock: Fetching booking', bookingId);
    return new Promise((resolve) => {
      setTimeout(() => {
        const response: BookingApiResponse = {
          success: true,
          data: {
            id: bookingId,
            user: {
              _id: '68ebed0a038233801dad3c0e',
              name: 'John Doe',
              email: 'utkarsh@yopmail.com'
            },
            consultant: {
              _id: '68f25551af10b30dec6bcc91',
              name: 'Dr. Sarah Johnson',
              email: 'sarah.johnson@consultation-visa.com'
            },
            date: '2025-10-29T00:00:00.000Z',
            startTime: '09:30',
            endTime: '10:00',
            duration: 30,
            amount: 100,
            currency: 'AUD',
            status: 'confirmed',
            paymentStatus: 'paid',
            notes: 'Document preparation\nAppeal process',
            isRescheduled: false,
            createdAt: '2025-10-17T17:16:23.217Z',
            canBeCancelled: true,
            canBeCancelledByUser: true,
            canBeRescheduled: true
          }
        };
        resolve(response);
      }, 300);
    });
  },

  // Create Payment Order API (matches Postman: POST /bookings/{bookingId}/payment/create)
  async createPaymentOrder(bookingId: string): Promise<CreatePaymentOrderResponse> {
    console.log('Mock: Creating payment order for booking', bookingId);
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderId = `PAYPAL_ORDER_${Date.now()}`;
        const response: CreatePaymentOrderResponse = {
          success: true,
          message: 'Payment order created successfully',
          data: {
            orderId,
            paymentId: `payment-${Date.now()}`,
            approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`,
            payment: {
              id: `payment-${Date.now()}`,
              amount: 100,
              currency: 'AUD',
              status: 'pending',
              paypalOrderId: orderId
            }
          }
        };
        resolve(response);
      }, 500);
    });
  },

  // Capture Payment API (matches Postman: POST /bookings/payment/capture/{orderId})
  async capturePayment(orderId: string): Promise<PaymentCaptureResponse> {
    console.log('Mock: Capturing payment for order', orderId);
    return new Promise((resolve) => {
      setTimeout(() => {
        const response: PaymentCaptureResponse = {
          success: true,
          message: 'Payment captured successfully',
          data: {
            id: `payment-${Date.now()}`,
            status: 'completed',
            amount: 100,
            currency: 'AUD',
            paypalOrderId: orderId,
            capturedAt: new Date().toISOString()
          }
        };
        
        resolve(response);
      }, 500);
    });
  },

  // Hold Slot API (for development)
  async holdSlot(slotId: string): Promise<{ success: boolean; message: string }> {
    console.log('Mock: Holding slot', slotId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Slot held successfully' });
      }, 300);
    });
  },

  // Release Slot API (for development)
  async releaseSlot(slotId: string): Promise<{ success: boolean; message: string }> {
    console.log('Mock: Releasing slot', slotId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Slot released successfully' });
      }, 300);
    });
  },

  // Verify Payment API (for development)
  async verifyPayment(paymentId: string): Promise<{ success: boolean; message: string }> {
    console.log('Mock: Verifying payment', paymentId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Payment verified successfully' });
      }, 300);
    });
  }
};