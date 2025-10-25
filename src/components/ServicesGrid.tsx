import { Link } from 'react-router-dom';
import type { Service } from '../lib/types/site';
import { formatCurrency } from '../lib/utils/format';
import { analytics } from '../lib/utils/analytics';

interface ServicesGridProps {
  services: Service[];
  showAll?: boolean;
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  const handleServiceClick = (service: Service) => {
    analytics.serviceCardClick(service.id, service.name);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => (
        <div key={service.id} className="card hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.shortDesc}</p>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Starting from</span>
              <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(service.startingPrice || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Duration: {service.durationMin || 0} mins</span>
              <span>{service.supportedCountries.length} countries</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {service.supportedCountries.slice(0, 3).map((country) => (
                <span
                  key={country}
                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                >
                  {country}
                </span>
              ))}
              {service.supportedCountries.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{service.supportedCountries.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/visa/${service.slug}`}
              onClick={() => handleServiceClick(service)}
              className="flex-1 btn-primary text-center"
            >
              Learn More
            </Link>
            <Link
              to={`/book?service=${service.slug}`}
              onClick={() => handleServiceClick(service)}
              className="flex-1 btn-secondary text-center"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
