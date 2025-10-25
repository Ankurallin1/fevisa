import { useEffect, useState } from 'react';
import { StaticContentLoader } from '../lib/utils/staticContentLoader';
import type { Site } from '../lib/types/site';
import { generateWhatsAppLink } from '../lib/utils/format';
import { analytics } from '../lib/utils/analytics';
import WhatsAppIcon from './icons/WhatsAppIcon';

interface WhatsAppButtonProps {
  variant?: 'bubble' | 'button';
  message?: string;
  className?: string;
}

export default function WhatsAppButton({ 
  variant = 'bubble', 
  message = "Hi! I'm interested in your Australia visa services. Can you help me?",
  className = ''
}: WhatsAppButtonProps) {
  const [site, setSite] = useState<Site | null>(null);

  useEffect(() => {
    const siteData = StaticContentLoader.loadSite();
    setSite(siteData);
  }, []);

  const handleClick = () => {
    if (site?.whatsappNumber) {
      analytics.whatsappClick(variant);
      const whatsappLink = generateWhatsAppLink(site.whatsappNumber, message);
      window.open(whatsappLink, '_blank');
    }
  };

  if (!site?.whatsappNumber) return null;


  if (variant === 'bubble') {
    return (
      <button
        onClick={handleClick}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${className}`}
        style={{ backgroundColor: site.whatsappGreen || '#25D366' }}
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors ${className}`}
    >
      <div style={{ color: site.whatsappGreen || '#25D366' }}>
        <WhatsAppIcon className="w-6 h-6" />
      </div>
      <span>WhatsApp</span>
    </button>
  );
}
