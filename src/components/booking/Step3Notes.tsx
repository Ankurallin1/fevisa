import React from 'react';
import { formatDate } from '../../lib/utils/format';
import { formatTime } from '../../lib/utils/timeFormat';
import type { AvailabilitySlot } from '../../lib/types/site';

interface Step3NotesProps {
  selectedSlot: AvailabilitySlot | null;
  selectedDate: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Notes: React.FC<Step3NotesProps> = ({
  selectedSlot,
  selectedDate,
  notes,
  onNotesChange,
  onNext,
  onBack,
}) => {

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Add Notes</h2>
        <p className="text-gray-600">
          Provide any additional information for your consultation
        </p>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDate(selectedDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">
              {selectedSlot ? `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}` : 'Not selected'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">30 minutes</span>
          </div>
        </div>
      </div>

      {/* Notes Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
        <p className="text-gray-600 mb-4">
          Please provide any specific questions, concerns, or information you'd like to discuss during your consultation.
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Consultation Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={6}
              className="input-field"
              placeholder="e.g., Specific visa type questions, document concerns, timeline requirements, etc."
            />
            <p className="text-sm text-gray-500 mt-2">
              {notes.length}/500 characters
            </p>
          </div>

          {/* Quick Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Notes (Click to add)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Student visa questions',
                'Work visa guidance',
                'Document preparation',
                'Timeline concerns',
                'Interview preparation',
                'Appeal process'
              ].map((quickNote) => (
                <button
                  key={quickNote}
                  onClick={() => {
                    const newNotes = notes ? `${notes}\n${quickNote}` : quickNote;
                    onNotesChange(newNotes);
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  + {quickNote}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          Back to Time Selection
        </button>
        <button
          onClick={onNext}
          className="btn-primary"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};
