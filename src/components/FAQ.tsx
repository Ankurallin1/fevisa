import { useState } from 'react';
import type { FAQ } from '../lib/types/site';

interface FAQProps {
  faqs: FAQ[];
}

export default function FAQ({ faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="card">
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full text-left flex justify-between items-center"
          >
            <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.q}</h3>
            <svg
              className={`w-5 h-5 text-primary-600 transition-transform duration-200 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {openIndex === index && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-700 leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
