import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StaticContentLoader } from '../lib/utils/staticContentLoader';
import type { Services } from '../lib/types/site';
import ServicesGrid from '../components/ServicesGrid';

export default function Services() {
  const [services, setServices] = useState<Services | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = StaticContentLoader.loadServices();
    setServices(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!services) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Services Not Available</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Professional Visa Services</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Expert visa assistance for all your international travel needs. From student visas to business permits, 
              we provide comprehensive support to make your global dreams a reality.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ServicesGrid services={services} showAll={true} />
        
        {/* Study Abroad Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Planning to Study Abroad?</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Explore top Australian universities specifically chosen for Indian students. 
              Compare rankings, tuition fees, and support services to find your perfect academic destination.
            </p>
            <Link
              to="/universities"
              className="inline-flex items-center bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              Explore Universities
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
