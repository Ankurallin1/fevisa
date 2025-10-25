import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookingFlow } from '../components/booking/BookingFlow';

export default function Book() {
  const [searchParams] = useSearchParams();

  // Handle URL parameters for step navigation
  useEffect(() => {
    const step = searchParams.get('step');
    if (step && ['1', '2', '3', '4'].includes(step)) {
      // Step navigation is handled by BookingFlow component
    }
  }, [searchParams]);

  return <BookingFlow />;
}
