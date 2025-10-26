import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookingsTable from '../components/BookingsTable';
// import DashboardWhatsAppButton from '../components/DashboardWhatsAppButton';
import { RescheduleModal } from '../components/RescheduleModal';
import { CancelBookingSelectionModal } from '../components/CancelBookingSelectionModal';
import { useAuth } from '../lib/contexts/AuthContext';
import { clearBookingSessionData } from '../lib/utils/sessionCleanup';

export default function Dashboard() {
  const { user } = useAuth();
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Clear all session data on initial mount
  useEffect(() => {
    console.log('Dashboard: Clearing all session data on mount');
    // clearAllSessionData();
    clearBookingSessionData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your visa consultation bookings and appointments.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Book Appointment */}
          <Link
            to="/book"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Book Appointment
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Schedule a new visa consultation
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>

          {/* Reschedule Appointment */}
          <button
            onClick={() => setShowRescheduleModal(true)}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Reschedule Appointment
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Modify your existing booking
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </button>

          {/* Explore Services */}
          <Link
            to="/services"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Explore Services
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Discover our consultation options
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>

          {/* Contact Support */}
          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Contact Support
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Get help from our support team
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

        </div>


        {/* Bookings Table */}
        <BookingsTable />

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Need Help?
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  If you have any questions about your bookings or need to make changes,
                  please contact our support team or use the WhatsApp button for immediate assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <DashboardWhatsAppButton /> */}

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
      />

      {/* Cancel Booking Selection Modal */}
      <CancelBookingSelectionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
      />
    </div>
  );
}
