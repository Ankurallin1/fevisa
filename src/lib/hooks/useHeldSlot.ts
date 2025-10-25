import { useState, useEffect, useCallback } from 'react';
import type { BookingSlot } from '../types/site';
import { api } from '../api';
import { analytics } from '../utils/analytics';

export interface HeldSlotHook {
  heldSlot: BookingSlot | null;
  holdExpiry: string | null;
  isHolding: boolean;
  holdSlot: (slot: BookingSlot) => Promise<boolean>;
  releaseSlot: () => Promise<void>;
  timeRemaining: number; // seconds
}

export function useHeldSlot(): HeldSlotHook {
  const [heldSlot, setHeldSlot] = useState<BookingSlot | null>(null);
  const [holdExpiry, setHoldExpiry] = useState<string | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Update time remaining every second
  useEffect(() => {
    if (!holdExpiry) {
      setTimeRemaining(0);
      return;
    }

    const updateTimeRemaining = () => {
      const now = new Date().getTime();
      const expiry = new Date(holdExpiry).getTime();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
      
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        setHeldSlot(null);
        setHoldExpiry(null);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [holdExpiry]);

  const holdSlot = useCallback(async (slot: BookingSlot): Promise<boolean> => {
    if (isHolding) return false;

    setIsHolding(true);
    
    try {
      await api.holdSlot(slot.id);
      
      setHeldSlot(slot);
      setHoldExpiry((Date.now() + 15 * 60 * 1000).toString()); // 15 minutes from now
      
      analytics.slotHeld(slot.id, slot.id); // Using slot.id as serviceId for now
      
      return true;
    } catch (error) {
      console.error('Failed to hold slot:', error);
      return false;
    } finally {
      setIsHolding(false);
    }
  }, [isHolding]);

  const releaseSlot = useCallback(async (): Promise<void> => {
    if (!heldSlot) return;

    try {
      // Find the hold ID (in a real app, this would be stored)
      const holdId = `hold-${heldSlot.id}`;
      await api.releaseSlot(holdId);
    } catch (error) {
      console.error('Failed to release slot:', error);
    } finally {
      setHeldSlot(null);
      setHoldExpiry(null);
    }
  }, [heldSlot]);

  return {
    heldSlot,
    holdExpiry,
    isHolding,
    holdSlot,
    releaseSlot,
    timeRemaining,
  };
}
