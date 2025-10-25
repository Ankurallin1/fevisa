import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../lib/api/authService';
import { CancelBookingModal } from './CancelBookingModal';

interface Booking {
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
}

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'paid' | 'refunded' | 'failed'>('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  

  useEffect(() => {
    loadBookings();
  }, [filter, currentPage, itemsPerPage]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const status = filter === 'all' ? undefined : filter;
      const response = await bookingService.getMyBookings(status, currentPage, itemsPerPage);
      
      if (response.success) {
        setBookings(response.data);
        
        // Update pagination state
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotalItems(response.pagination.totalItems);
          setItemsPerPage(response.pagination.itemsPerPage);
          setHasNextPage(response.pagination.hasNextPage);
          setHasPrevPage(response.pagination.hasPrevPage);
        }
      } else {
        setError('Failed to load bookings');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelSuccess = () => {
    loadBookings(); // Reload bookings
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    
    switch (status) {
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    
    switch (paymentStatus) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'refunded':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Since we're now using server-side filtering, we only need to filter by payment status on the client side
  const filteredBookings = bookings.filter(booking => {
    const paymentMatch = paymentFilter === 'all' || booking.paymentStatus === paymentFilter;
    return paymentMatch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">My Bookings</h3>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as any);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value as any);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Payments</option>
              <option value="pending">Payment Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={loadBookings}
              className="btn-secondary text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? "You haven't made any bookings yet." 
                : `No ${filter} bookings found.`
              }
            </p>
            <div className="mt-6">
              <Link
                to="/book"
                className="btn-primary"
              >
                Book Your First Appointment
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consultant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(booking.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {booking.duration} min
                        
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.consultant.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.consultant.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.currency} {booking.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getPaymentStatusBadge(booking.paymentStatus)}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {booking.canBeCancelledByUser && (
                          <button
                            onClick={() => handleCancelBooking(booking)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                        {(
                          <Link
                            to={`/booking/reschedule/${booking.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Reschedule
                          </Link>
                        )}
                        <Link
                          to={`/booking/confirm/${booking.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalItems > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Items per page selector */}
              <div className="flex items-center space-x-2">
                <label htmlFor="items-per-page" className="text-sm text-gray-700">Show:</label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
              
              {/* Navigation arrows - only show when multiple pages */}
              { (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    className={`p-2 rounded-md ${
                      hasPrevPage
                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                    title="Previous page"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 text-sm rounded-md ${
                            currentPage === pageNum
                              ? 'bg-primary-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className={`p-2 rounded-md ${
                      hasNextPage
                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                    title="Next page"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Cancel Booking Modal */}
      {selectedBooking && (
        <CancelBookingModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedBooking(null);
          }}
          bookingId={selectedBooking.id}
          bookingDetails={{
            date: selectedBooking.date,
            startTime: selectedBooking.startTime,
            endTime: selectedBooking.endTime,
            consultant: selectedBooking.consultant.name,
            amount: selectedBooking.amount,
            currency: selectedBooking.currency,
          }}
          onSuccess={handleCancelSuccess}
        />
      )}
    </div>
  );
}
