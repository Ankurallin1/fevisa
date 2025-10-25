import { useState } from 'react';
import type { Service, BookingSlot, BookingDetails } from '../lib/types/site';
import { useQuickVerify } from '../lib/hooks/useQuickVerify';
import { formatDateTime } from '../lib/utils/format';

interface VerifyFormProps {
  service: Service;
  slot: BookingSlot;
  onSubmit: (details: BookingDetails) => void;
  onBack: () => void;
}

export default function VerifyForm({ service, slot, onSubmit, onBack }: VerifyFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryOfTravel: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isVerifying, isVerified, error: verifyError, sendOTP } = useQuickVerify();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.countryOfTravel.trim()) {
      newErrors.countryOfTravel = 'Country of travel is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!formData.phone.trim()) {
      setErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
      return;
    }

    await sendOTP(formData.phone);
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const details: BookingDetails = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        countryOfTravel: formData.countryOfTravel.trim(),
        notes: formData.notes.trim() || undefined,
      };

      onSubmit(details);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Details</h2>
          <p className="text-gray-600">Please provide your information to complete the booking</p>
        </div>
        <button onClick={onBack} className="btn-secondary">
          Back to Time Selection
        </button>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Service</div>
            <div className="font-medium text-gray-900">{service.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Date & Time</div>
            <div className="font-medium text-gray-900">{formatDateTime(slot.date + 'T' + slot.time)}</div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="countryOfTravel" className="block text-sm font-medium text-gray-700 mb-2">
              Country of Travel *
            </label>
            <select
              id="countryOfTravel"
              name="countryOfTravel"
              value={formData.countryOfTravel}
              onChange={handleInputChange}
              className={`input-field ${errors.countryOfTravel ? 'border-red-500' : ''}`}
            >
              <option value="">Select country</option>
              {service.supportedCountries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {errors.countryOfTravel && <p className="mt-1 text-sm text-red-600">{errors.countryOfTravel}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="input-field"
            placeholder="Any additional information or questions..."
          />
        </div>

        {/* OTP Verification */}
        {!isVerified && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Phone Verification</h4>
            <p className="text-sm text-blue-700 mb-4">
              We'll send you a verification code to confirm your phone number.
            </p>
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={isVerifying || !formData.phone.trim()}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? 'Sending...' : 'Send Verification Code'}
            </button>
            {verifyError && <p className="mt-2 text-sm text-red-600">{verifyError}</p>}
          </div>
        )}

        {isVerified && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 font-medium">Phone number verified successfully</span>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isVerified}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Continue to Payment'}
          </button>
        </div>
      </form>
    </div>
  );
}
