import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Service } from '../lib/types/site';
import { formatCurrency } from '../lib/utils/format';
import { analytics } from '../lib/utils/analytics';

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      api.getService(slug).then((data) => {
        setService(data);
        setLoading(false);
      });
    }
  }, [slug]);

  const handleBookClick = () => {
    if (service) {
      analytics.bookClick('service-detail');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
          <Link to="/services" className="btn-primary">
            View All Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.name}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{service.longDesc}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary-600">
                  {formatCurrency(service.startingPrice || 0)}
                </div>
                <div className="text-sm text-gray-600">Starting from</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{service.durationMin || 0}</div>
                <div className="text-sm text-gray-600">Days processing</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{service.supportedCountries.length}</div>
                <div className="text-sm text-gray-600">Countries supported</div>
              </div>
            </div>

            <Link
              to={`/book?service=${service.slug}`}
              onClick={handleBookClick}
              className="btn-primary text-lg px-8 py-4"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Inclusions */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
            <ul className="space-y-3">
              {service.inclusions.map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Not Included</h2>
            <ul className="space-y-3">
              {service.exclusions.map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timelines and Documents */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timelines */}
          {service.timelines && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Processing Timeline</h2>
              <p className="text-gray-700">{service.timelines}</p>
            </div>
          )}

          {/* Documents */}
          {service.documents && service.documents.length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Documents</h2>
              <ul className="space-y-3">
                 {service.documents?.map((doc: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-gray-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Supported Countries */}
        <div className="mt-12">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Supported Countries</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {service.supportedCountries.map((country) => (
                <div key={country} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">{country}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="mt-12">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {service.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-700">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="card bg-primary-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Book your consultation today and let our experts guide you through the process.
            </p>
            <Link
              to={`/book?service=${service.slug}`}
              onClick={handleBookClick}
              className="btn-primary text-lg px-8 py-4"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
