import { useState } from 'react';

export interface QuickVerifyHook {
  isVerifying: boolean;
  isVerified: boolean;
  error: string | null;
  sendOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
  reset: () => void;
}

export function useQuickVerify(): QuickVerifyHook {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOTP = async (phone: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);

    try {
      // TODO: Replace with real OTP service (Twilio, AWS SNS, etc.)
      console.log('Sending OTP to:', phone);
      
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In development, always succeed
      if (import.meta.env.DEV) {
        console.log('Mock OTP sent successfully');
        return true;
      }
      
      // TODO: Real OTP integration
      // const response = await otpService.sendOTP(phone);
      // return response.success;
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(errorMessage);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);

    try {
      // TODO: Replace with real OTP verification
      console.log('Verifying OTP:', otp, 'for phone:', phone);
      
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In development, accept any 6-digit OTP
      if (import.meta.env.DEV) {
        const isValid = /^\d{6}$/.test(otp);
        if (isValid) {
          setIsVerified(true);
          console.log('Mock OTP verified successfully');
          return true;
        } else {
          throw new Error('Invalid OTP format');
        }
      }
      
      // TODO: Real OTP verification
      // const response = await otpService.verifyOTP(phone, otp);
      // setIsVerified(response.verified);
      // return response.verified;
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OTP verification failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const reset = () => {
    setIsVerifying(false);
    setIsVerified(false);
    setError(null);
  };

  return {
    isVerifying,
    isVerified,
    error,
    sendOTP,
    verifyOTP,
    reset,
  };
}
