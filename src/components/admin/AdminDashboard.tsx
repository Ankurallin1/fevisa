import React, { useState } from 'react';
import { HolidaysManagement } from './HolidaysManagement';
import { AllBookingsTable } from './AllBookingsTable';
import { UsersManagement } from './UsersManagement';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'holidays' | 'users'>('bookings');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage bookings and holidays for the consultation system.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users Management
            </button>
            <button
              onClick={() => setActiveTab('holidays')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'holidays'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Holidays Management
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'bookings' && <AllBookingsTable />}
          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'holidays' && <HolidaysManagement />}
        </div>
      </div>
    </div>
  );
};
