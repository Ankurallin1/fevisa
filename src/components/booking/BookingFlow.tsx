import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBookingState } from '../../lib/hooks/useBookingState';
import { Step1PlanPricing } from './Step1PlanPricing';
import { Step2DateSelection } from './Step2DateSelection';
import { Step3Notes } from './Step3Notes';
import { Step4Payment } from './Step4Payment';

export const BookingFlow: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    currentStep,
    pricing,
    pricingLoading,
    pricingError,
    selectedDate,
    availability,
    availabilityLoading,
    availabilityError,
    selectedSlot,
    notes,
    // loadPricing,
    checkAvailability,
    selectSlot,
    updateNotes,
    nextStep,
    prevStep,
    canProceedToStep,
    getStepTitle,
    getStepDescription,
  } = useBookingState();

  // Handle URL parameters for step navigation
  useEffect(() => {
    const step = searchParams.get('step');
    if (step && ['1', '2', '3', '4'].includes(step)) {
      const stepNumber = parseInt(step);
      if (canProceedToStep(stepNumber)) {
        // Allow navigation to this step
      }
    }
  }, [searchParams, canProceedToStep]);

  // Load availability when date changes (only when user manually selects a date)
  // This is now handled by the Step2DateSelection component directly

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PlanPricing
            pricing={pricing}
            loading={pricingLoading}
            error={pricingError}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2DateSelection
            selectedDate={selectedDate}
            availability={availability}
            loading={availabilityLoading}
            error={availabilityError}
            selectedSlot={selectedSlot}
            onDateSelect={checkAvailability}
            onSlotSelect={selectSlot}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <Step3Notes
            selectedSlot={selectedSlot}
            selectedDate={selectedDate}
            notes={notes}
            onNotesChange={updateNotes}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <Step4Payment
            selectedSlot={selectedSlot}
            selectedDate={selectedDate}
            notes={notes}
            pricing={pricing}
            onBack={prevStep}
          />
        );
      default:
        return (
          <Step1PlanPricing
            pricing={pricing}
            loading={pricingLoading}
            error={pricingError}
            onNext={nextStep}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step <= currentStep
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {step}
                </div>
                <div className="ml-4">
                  <div className={`text-sm font-medium ${
                    step <= currentStep ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {getStepTitle(step)}
                  </div>
                  <div className="text-xs text-gray-500">{getStepDescription(step)}</div>
                </div>
                {step < 4 && (
                  <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                    step < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderCurrentStep()}
        </div>

        {/* Step Navigation (Mobile) */}
        <div className="mt-8 flex justify-between sm:hidden">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === 4 || !canProceedToStep(currentStep + 1)}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
