import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/contexts/AuthContext';

export default function DashboardHeader() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const handleBookNow = () => {
    navigate('/book');
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">
              VisaPro Dashboard
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/book"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Book Appointment
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Services
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBookNow}
              className="btn-primary"
            >
              Book Now
            </button>

            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block">{user?.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/book"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Book Appointment
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isUserMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/dashboard"
                onClick={() => setIsUserMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                to="/book"
                onClick={() => setIsUserMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              >
                Book Appointment
              </Link>
              <Link
                to="/services"
                onClick={() => setIsUserMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              >
                Services
              </Link>
              <button
                onClick={handleBookNow}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Book Now
              </button>
              <div className="border-t pt-2">
                <div className="px-3 py-2 text-sm text-gray-700">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-gray-500">{user?.email}</div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsUserMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
