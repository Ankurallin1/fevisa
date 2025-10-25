import { useState, useEffect } from 'react';
import type { Service } from '../lib/types/site';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/utils/format';
import { analytics } from '../lib/utils/analytics';

interface ServicePickerProps {
  onServiceSelect: (service: Service) => void;
}

export default function ServicePicker({ onServiceSelect }: ServicePickerProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    api.listServices().then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    analytics.serviceCardClick(service.id, service.name);
  };

  const handleContinue = () => {
    if (selectedService) {
      onServiceSelect(selectedService);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading services...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select a Service</h2>
        <p className="text-gray-600">Choose the visa service that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceClick(service)}
            className={`card cursor-pointer transition-all duration-200 ${
              selectedService?.id === service.id
                ? 'ring-2 ring-primary-500 bg-primary-50'
                : 'hover:shadow-lg'
            }`}
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.shortDesc}</p>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Starting from</span>
                <span className="text-xl font-bold text-primary-600">
                  {formatCurrency(service.startingPrice || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Duration: {service.durationMin || 0} days</span>
                <span>{service.supportedCountries.length} countries</span>
              </div>
            </div>

            <div className="mb-4">
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

            {selectedService?.id === service.id && (
              <div className="flex items-center text-primary-600 font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Selected
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedService}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Time Selection
        </button>
      </div>
    </div>
  );
}
