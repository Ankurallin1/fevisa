import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { BookingApi, Service } from '../lib/types/site';
import { generateWhatsAppLink } from '../lib/utils/format';
import { generateICS, downloadICS } from '../lib/utils/ics';
import { analytics } from '../lib/utils/analytics';
import { clearBookingSessionData } from '../lib/utils/sessionCleanup';
import { handleApiResponse, createErrorMessage } from '../lib/utils/apiResponse';

export default function BookingConfirm() {
  const { ref } = useParams<{ ref: string }>();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<BookingApi | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (ref) {
      console.log('BookingConfirm: Loading booking with ref:', ref);
      
      // Check if this is a payment capture scenario
      const token = searchParams.get('token');
      
      if (token) {
        console.log('BookingConfirm: Payment capture detected, token:', token);
        handlePaymentCapture(token);
      } else {
        // Regular booking confirmation flow
        loadBookingDetails(ref);
      }
    }
  }, [ref, searchParams]);

  const handlePaymentCapture = async (token: string) => {
    try {
      console.log('BookingConfirm: Capturing payment for token:', token);
      setPaymentStatus('processing');
      
      const response = await api.capturePayment(token);
      console.log('BookingConfirm: Payment capture response:', response);
      
      // Handle API response with proper message display
      const captureData = handleApiResponse(
        response,
        'Payment Confirmed',
        'Payment Capture Failed'
      );
      
      if (captureData) {
        console.log('BookingConfirm: Payment capture successful');
        setPaymentStatus('success');
        
        // The capture response should contain the booking ID
        const bookingId = captureData.bookingId || captureData.booking?.id;
        console.log('BookingConfirm: Booking ID from capture response:', bookingId);
        
        if (bookingId) {
          // Load booking details using the booking ID from the capture response
          loadBookingDetails(bookingId);
        } else {
          console.error('BookingConfirm: No booking ID found in capture response');
          setError('Payment successful but booking details not found');
          setLoading(false);
        }
      } else {
        console.log('BookingConfirm: Payment capture failed');
        setPaymentStatus('failed');
        setPaymentError(createErrorMessage(response));
        setLoading(false);
      }
    } catch (error: any) {
      console.error('BookingConfirm: Payment capture error:', error);
      setPaymentStatus('failed');
      setPaymentError(error.message || 'Payment capture failed');
            setLoading(false);
    }
  };

  const loadBookingDetails = async (bookingId: string) => {
    try {
      const response = await api.getBooking(bookingId);
      console.log('BookingConfirm: API response:', response);
      
      if (response && response.success && response.data) {
        setBooking(response.data);
        
        // Clear all booking-related sessionStorage data since booking is confirmed
        clearBookingSessionData();
        
        // Set a default service since we don't have serviceId in the new structure
        setService({
          id: 'default',
          slug: 'default',
          name: 'Visa Consultation',
          shortDesc: 'Professional visa consultation',
          longDesc: 'Expert visa consultation service',
          inclusions: ['Consultation', 'Document review', 'Guidance'],
          exclusions: ['Application fees'],
          supportedCountries: ['Australia'],
          faqs: []
        });
        setLoading(false);
        } else {
        console.log('BookingConfirm: No booking data found');
        setError('Booking not found');
          setLoading(false);
        }
    } catch (error: any) {
      console.error('BookingConfirm: Error loading booking:', error);
      setError('Failed to load booking details');
      setLoading(false);
    }
  };

  const handleAddToCalendar = () => {
    if (!booking) return;

    const startDate = new Date(booking.createdAt);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    const serviceName = service?.name || 'Visa Consultation';
    const event = {
      title: `${serviceName} - Visa Consultation`,
      description: `Your visa consultation for ${serviceName} is scheduled. Please bring all required documents.`,
      startDate,
      endDate,
      location: 'VisaPro Services Office',
      organizer: {
        name: 'VisaPro Services',
        email: 'hello@visapro.example',
      },
    };

    const icsContent = generateICS(event);
    downloadICS(icsContent, `visa-consultation-${ref}.ics`);
  };

  const handleWhatsAppClick = () => {
    if (!booking) return;
    
    analytics.whatsappClick('confirmation');
    const message = `Hi! I have a booking ID ${booking.id} for my visa consultation. Can you help me with any questions?`;
    const whatsappLink = generateWhatsAppLink('911234567890', message);
    window.open(whatsappLink, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          {paymentStatus === 'processing' ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
              <p className="text-gray-600">Please wait while we confirm your payment...</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Booking</h2>
              <p className="text-gray-600">Please wait while we load your booking details...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-4">We were unable to process your payment.</p>
          {paymentError && (
            <p className="text-red-600 mb-4 font-medium">{paymentError}</p>
          )}
          <div className="space-y-4">
            <Link to="/book" className="btn-primary">
              Try Booking Again
            </Link>
            <Link to="/" className="btn-secondary ml-4">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Booking</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-8">Reference: {ref}</p>
          <div className="space-y-4">
            <Link to="/" className="btn-primary">
              Go Home
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-secondary ml-4"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-4">The booking reference you're looking for doesn't exist.</p>
          <p className="text-sm text-gray-500 mb-8">Reference: {ref}</p>
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dynamic Header based on booking status */}
        <div className="text-center mb-8">
          {booking.status === 'confirmed' ? (
            <>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">Your visa consultation has been successfully booked</p>
            </>
          ) : booking.status === 'pending' ? (
            <>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Pending</h1>
              <p className="text-lg text-gray-600">Your booking is being processed</p>
            </>
          ) : booking.status === 'cancelled' ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Cancelled</h1>
              <p className="text-lg text-gray-600">
                {booking.paymentStatus === 'refunded' 
                  ? 'Your booking has been cancelled and refund has been processed'
                  : 'Your booking has been cancelled'
                }
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Details</h1>
              <p className="text-lg text-gray-600">View your booking information</p>
            </>
          )}
        </div>

        {/* Booking Details */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Booking ID</div>
              <div className="font-mono text-lg font-semibold text-primary-600">{booking.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                booking.status === 'confirmed' 
                  ? 'bg-green-100 text-green-800'
                  : booking.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : booking.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Service</div>
              <div className="font-medium text-gray-900">{service?.name || 'Visa Consultation'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Amount</div>
              <div className="font-semibold text-gray-900">
                {booking.currency} {booking.amount}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Payment Status</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                booking.paymentStatus === 'paid' 
                  ? 'bg-green-100 text-green-800'
                  : booking.paymentStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : booking.paymentStatus === 'refunded'
                  ? 'bg-blue-100 text-blue-800'
                  : booking.paymentStatus === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Customer Name</div>
              <div className="font-medium text-gray-900">{booking.user.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Email</div>
              <div className="font-medium text-gray-900">{booking.user.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Consultant</div>
              <div className="font-medium text-gray-900">{booking.consultant.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Date & Time</div>
              <div className="font-medium text-gray-900">
                {new Date(booking.date).toLocaleDateString()} at {booking.startTime} - {booking.endTime}
              </div>
            </div>
          </div>
          
          {booking.isRescheduled && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-sm font-medium text-orange-800">This booking has been rescheduled</div>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                The appointment time has been changed from the original booking.
              </p>
            </div>
          )}

          {booking.notes && (
            <div className="mt-6">
              <div className="text-sm text-gray-600 mb-1">Additional Notes</div>
              <div className="font-medium text-gray-900">{booking.notes}</div>
            </div>
          )}
        </div>

        {/* Next Steps - Conditional based on booking status */}
        {booking.status === 'confirmed' && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-sm font-semibold text-primary-600">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Check Your Email</h3>
                <p className="text-gray-600">We've sent you a confirmation email with all the details and next steps.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-sm font-semibold text-primary-600">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Prepare Documents</h3>
                <p className="text-gray-600">Start gathering the required documents for your visa application.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-sm font-semibold text-primary-600">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Attend Consultation</h3>
                <p className="text-gray-600">Come to our office at the scheduled time for your consultation.</p>
              </div>
            </div>
          </div>
        </div>
        )}

        {booking.status === 'pending' && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-sm font-semibold text-yellow-600">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Wait for Confirmation</h3>
                  <p className="text-gray-600">We're processing your booking and will send you a confirmation email soon.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-sm font-semibold text-yellow-600">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Check Your Email</h3>
                  <p className="text-gray-600">Keep an eye on your email for booking confirmation and next steps.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {booking.status === 'cancelled' && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Cancellation Details</h2>
            <div className="space-y-4">
              {booking.paymentStatus === 'refunded' && (
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Refund Processed</h3>
                    <p className="text-gray-600">Your refund has been processed and will be credited to your original payment method within 3-5 business days.</p>
                  </div>
                </div>
              )}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-600">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Book a New Appointment</h3>
                  <p className="text-gray-600">If you'd like to schedule a new consultation, you can book another appointment.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Conditional based on booking status */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {booking.status === 'confirmed' && (
            <>
          <button
            onClick={handleAddToCalendar}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add to Calendar
          </button>
              
              {booking.canBeRescheduled && (
                <Link
                  to={`/booking/reschedule/${booking.id}`}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Reschedule
                </Link>
              )}
            </>
          )}

          {booking.status === 'cancelled' && (
            <Link
              to="/book"
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book New Appointment
            </Link>
          )}
          
          <button
            onClick={handleWhatsAppClick}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Chat on WhatsApp
          </button>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
