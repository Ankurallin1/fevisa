import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SignupForm } from '../components/auth/SignupForm';
import { LoginForm } from '../components/auth/LoginForm';
import { OtpVerificationForm } from '../components/auth/OtpVerificationForm';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';
import { useAuthRedirect } from '../components/AuthRedirect';

type AuthStep = 'login' | 'signup' | 'otp-verification' | 'forgot-password' | 'reset-password';

export const Auth: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { redirectAfterLogin } = useAuthRedirect();

  // Handle URL parameters for step and redirect
  useEffect(() => {
    const step = searchParams.get('step');
    
    if (step && ['login', 'signup', 'otp-verification', 'forgot-password', 'reset-password'].includes(step)) {
      setCurrentStep(step as AuthStep);
    }
  }, [searchParams]);

  const handleSignupSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentStep('otp-verification');
  };

  const handleOtpSuccess = () => {
    const redirectPath = searchParams.get('redirect');
    redirectAfterLogin(redirectPath || undefined);
  };

  const handleLoginSuccess = () => {
    const redirectPath = searchParams.get('redirect');
    
    // Check if there's booking data in session storage
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData) {
      try {
        const parsedData = JSON.parse(bookingData);
        // Redirect to booking with the saved step
        window.location.href = `/book?step=${parsedData.step || 4}`;
        return;
      } catch (error) {
        console.error('Failed to parse booking data:', error);
        sessionStorage.removeItem('bookingData');
      }
    }
    
    redirectAfterLogin(redirectPath || undefined);
  };

  const handleForgotPasswordSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentStep('reset-password');
  };

  const handleResetSuccess = () => {
    navigate('/auth?step=login');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'login':
        return (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setCurrentStep('signup')}
            onSwitchToForgotPassword={() => setCurrentStep('forgot-password')}
          />
        );
      case 'signup':
        return (
          <SignupForm
            onSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setCurrentStep('login')}
          />
        );
      case 'otp-verification':
        return (
          <OtpVerificationForm
            email={email}
            onSuccess={handleOtpSuccess}
            onBack={() => setCurrentStep('signup')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSuccess={handleForgotPasswordSuccess}
            onBack={() => setCurrentStep('login')}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordForm
            email={email}
            onSuccess={handleResetSuccess}
            onBack={() => setCurrentStep('login')}
          />
        );
      default:
        return (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setCurrentStep('signup')}
            onSwitchToForgotPassword={() => setCurrentStep('forgot-password')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600">
            {currentStep === 'login' && 'Sign in to your account'}
            {currentStep === 'signup' && 'Create your account'}
            {currentStep === 'otp-verification' && 'Verify your email'}
            {currentStep === 'forgot-password' && 'Reset your password'}
            {currentStep === 'reset-password' && 'Set new password'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {renderCurrentStep()}
      </div>
    </div>
  );
};
