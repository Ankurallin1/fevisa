import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StaticContentLoader } from '../lib/utils/staticContentLoader';
import type { Service } from '../lib/types/site';
import { formatCurrency } from '../lib/utils/format';
import { analytics } from '../lib/utils/analytics';

export default function VisaDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const services = StaticContentLoader.loadServices();
      const foundService = services.find(s => s.slug === slug);
      setService(foundService || null);
      setLoading(false);
    }
  }, [slug]);

  const handleBookClick = () => {
    if (service) {
      analytics.bookClick('visa-detail');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Visa Service Not Found</h1>
          <p className="text-gray-600">The requested visa service could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              {service.longDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBookClick}
                className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Book Consultation - {formatCurrency(service.startingPrice || 0)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <ul className="space-y-3">
                {service.inclusions.map((inclusion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{inclusion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Not Included</h2>
              <ul className="space-y-3">
                {service.exclusions.map((exclusion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-3 mt-1">✗</span>
                    <span className="text-gray-700">{exclusion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Supported Countries</h2>
              <div className="flex flex-wrap gap-2">
                {service.supportedCountries.map((country, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & FAQ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Starting Price</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(service.startingPrice || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {service.durationMin} minutes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Countries</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {service.supportedCountries.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {service.faqs.map((faq, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

