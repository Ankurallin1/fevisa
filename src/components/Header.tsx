import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StaticContentLoader } from '../lib/utils/staticContentLoader';
import type { Site } from '../lib/types/site';
import { generateWhatsAppLink } from '../lib/utils/format';
import { analytics } from '../lib/utils/analytics';
import { useAuth } from '../lib/contexts/AuthContext';

export default function Header() {
  const [site, setSite] = useState<Site | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const siteData = StaticContentLoader.loadSite();
    setSite(siteData);
  }, []);

  const handleWhatsAppClick = () => {
    if (site) {
      analytics.whatsappClick('header');
      const message = `Hi! I'm interested in your visa services. Can you help me?`;
      const whatsappLink = generateWhatsAppLink(site.whatsappNumber, message);
      window.open(whatsappLink, '_blank');
    }
  };

  const handleBookClick = () => {
    analytics.bookClick('header');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  if (!site) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-primary-600">VisaPro Services</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-bold text-primary-600 group-hover:text-primary-700 transition-colors duration-200">
              {site.brandName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Public Navigation Items */}
            {site.nav
              .filter(item => !isAuthenticated || item.label !== 'Login')
              .map((item) => {
              if (item.variant === 'button') {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={handleBookClick}
                    className="px-4 py-2 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    {item.label}
                  </Link>
                );
              }

              if (item.href.startsWith('#')) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="relative px-3 py-2 text-gray-700 hover:text-primary-600 transition-all duration-200 hover:bg-primary-50 rounded-lg group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full"></span>
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`relative px-3 py-2 transition-all duration-200 hover:bg-primary-50 rounded-lg group ${
                    location.pathname === item.href 
                      ? 'text-primary-600 font-medium bg-primary-50' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-600 transition-all duration-200 ${
                    location.pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              );
            })}
            
            {/* Role-based navigation for authenticated users */}
            {isAuthenticated && (
              <>
                {user?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className={`text-gray-700 hover:text-primary-600 transition-colors ${
                      location.pathname === '/admin' ? 'text-primary-600 font-medium' : ''
                    }`}
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className={`text-gray-700 hover:text-primary-600 transition-colors ${
                      location.pathname === '/dashboard' ? 'text-primary-600 font-medium' : ''
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
            
            {/* Authentication */}
            {isAuthenticated ? (
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
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth?step=signup"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-green-500 hover:bg-green-600 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Public Navigation Items */}
              {site.nav
                .filter(item => !isAuthenticated || item.label !== 'Login')
                .map((item) => {
                if (item.variant === 'button') {
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => {
                        handleBookClick();
                        setIsMenuOpen(false);
                      }}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      {item.label}
                    </Link>
                  );
                }

                if (item.href.startsWith('#')) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.href
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              {/* Role-based navigation for authenticated users */}
              {isAuthenticated && (
                <>
                  {user?.role === 'admin' ? (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        location.pathname === '/admin'
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        location.pathname === '/dashboard'
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    >
                      Dashboard
                    </Link>
                  )}
                </>
              )}
              
              {/* Mobile Authentication */}
              {isAuthenticated ? (
                <div className="border-t pt-2">
                  <div className="px-3 py-2 text-sm text-gray-700">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t pt-2 space-y-2">
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth?step=signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              <button
                onClick={() => {
                  handleWhatsAppClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-green-500 hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
