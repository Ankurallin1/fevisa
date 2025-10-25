import React from 'react';
// import { api } from '../../lib/api';
import type { PricingResponse } from '../../lib/types/site';

interface Step1PlanPricingProps {
  pricing: PricingResponse | null;
  loading: boolean;
  error: string | null;
  onNext: () => void;
}

export const Step1PlanPricing: React.FC<Step1PlanPricingProps> = ({
  pricing,
  loading,
  error,
  onNext,
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading pricing information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!pricing?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No pricing information available</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Consultation Plan</h2>
        <p className="text-gray-600">
          Professional visa consultation service with expert guidance
        </p>
      </div>

      {/* Plan Details */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Visa Consultation</h3>
          <p className="text-gray-600">Expert guidance for your visa application</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">One-on-one consultation with visa expert</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">Document review and preparation guidance</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">Application strategy and timeline</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">Follow-up support and questions</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {pricing.data.currency} {pricing.data.amount}
          </div>
          <p className="text-gray-600">One-time consultation fee</p>
          <p className="text-sm text-gray-500 mt-2">
            Valid for {pricing.data.country} residents
          </p>
          <p className="text-sm text-gray-500">
            Duration: {pricing.data.duration} minutes
          </p>
        </div>
      </div>

      {/* Next Button */}
      <div className="text-center">
        <button
          onClick={onNext}
          className="btn-primary text-lg px-8 py-3"
        >
          Continue to Date Selection
        </button>
      </div>
    </div>
  );
};


