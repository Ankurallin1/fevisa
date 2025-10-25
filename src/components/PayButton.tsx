import { useState } from 'react';
import type { Service, BookingSlot, BookingDetails } from '../lib/types/site';
import { usePayment } from '../lib/hooks/usePayment';
import { formatCurrency, formatDateTime } from '../lib/utils/format';

interface PayButtonProps {
  service: Service;
  slot: BookingSlot;
  details: BookingDetails;
  orderId: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function PayButton({ service, slot, details, orderId, onSuccess, onBack }: PayButtonProps) {
  const { isProcessing, error, processPayment } = usePayment();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');

  const handlePayment = async () => {
    setShowPaymentModal(true);
    
    // Simulate payment processing
    const success = await processPayment(orderId, service.startingPrice || 0);
    
    if (success) {
      setShowPaymentModal(false);
      onSuccess();
    }
  };

  const PaymentModal = () => {
    if (!showPaymentModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="space-y-2">
                {[
                  { value: 'card', label: 'Credit/Debit Card' },
                  { value: 'upi', label: 'UPI' },
                  { value: 'netbanking', label: 'Net Banking' },
                ].map((method) => (
                  <label key={method.value} className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-2"
                    />
                    {method.label}
                  </label>
                ))}
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="input-field"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="input-field"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="input-field"
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@paytm"
                  className="input-field"
                  disabled
                />
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank</label>
                <select className="input-field" disabled>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-primary-600">
                  {formatCurrency(service.startingPrice || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="btn-secondary"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="btn-primary disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
          <p className="text-gray-600">Review your booking and complete the payment</p>
        </div>
        <button onClick={onBack} className="btn-secondary">
          Back to Details
        </button>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Service</div>
              <div className="font-medium text-gray-900">{service.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Date & Time</div>
              <div className="font-medium text-gray-900">{formatDateTime(slot.date + 'T' + slot.time)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Name</div>
              <div className="font-medium text-gray-900">{details.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-medium text-gray-900">{details.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Phone</div>
              <div className="font-medium text-gray-900">{details.phone}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Country of Travel</div>
              <div className="font-medium text-gray-900">{details.countryOfTravel}</div>
            </div>
          </div>
          
          {details.notes && (
            <div>
              <div className="text-sm text-gray-600">Notes</div>
              <div className="font-medium text-gray-900">{details.notes}</div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Service Fee</span>
            <span className="font-medium">{formatCurrency(service.startingPrice || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Processing Fee</span>
            <span className="font-medium">A$0</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-primary-600">
                {formatCurrency(service.startingPrice || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className="text-center">
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="btn-primary text-lg px-12 py-4 disabled:opacity-50"
        >
          {isProcessing ? 'Processing Payment...' : 'Pay & Confirm Booking'}
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Your payment is secure and encrypted
        </p>
      </div>

      <PaymentModal />
    </div>
  );
}
