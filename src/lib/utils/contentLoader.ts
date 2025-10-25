import { SiteSchema, HeroSchema, ServicesSchema, ProcessSchema, ContactSchema, FAQsSchema } from '../types/site';
import type { Site, Hero, Services, Process, Contact, FAQs } from '../types/site';

// Content loader with validation
export class ContentLoader {
  private static cache = new Map<string, any>();

  static async loadSite(): Promise<Site> {
    if (this.cache.has('site')) {
      return this.cache.get('site');
    }

    try {
      const response = await fetch('/src/content/site.json');
      const data = await response.json();
      const validated = SiteSchema.parse(data);
      this.cache.set('site', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to load or validate site.json:', error);
      // Return fallback data
      return {
        brandName: 'VisaPro Services',
        countryFocus: 'Australia',
        whatsappNumber: '911234567890',
        email: 'hello@visapro.example',
        phone: '+91 12345 67890',
        address: '2nd Floor, Business Plaza, Connaught Place, New Delhi - 110001',
        social: {
          facebook: 'https://facebook.com/visapro',
          instagram: 'https://instagram.com/visapro',
          linkedin: 'https://linkedin.com/company/visapro',
        },
        nav: [
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'How We Work', href: '#how' },
          { label: 'Contact', href: '#contact' },
          { label: 'Book Consultation', href: '/book', variant: 'button' as const },
        ],
      };
    }
  }

  static async loadHero(): Promise<Hero> {
    if (this.cache.has('hero')) {
      return this.cache.get('hero');
    }

    try {
      const response = await fetch('/src/content/hero.json');
      const data = await response.json();
      const validated = HeroSchema.parse(data);
      this.cache.set('hero', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to load or validate hero.json:', error);
      return {
        headline: 'Your Gateway to Global Opportunities',
        subheadline: 'Expert visa services for students, professionals, and families.',
        primaryCta: { label: 'Book Consultation', href: '/book' },
        secondaryCta: { label: 'Chat on WhatsApp', href: 'whatsapp:auto' },
      };
    }
  }

  static async loadServices(): Promise<Services> {
    if (this.cache.has('services')) {
      return this.cache.get('services');
    }

    try {
      const response = await fetch('/src/content/services.json');
      const data = await response.json();
      const validated = ServicesSchema.parse(data);
      this.cache.set('services', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to load or validate services.json:', error);
      return [];
    }
  }

  static async loadProcess(): Promise<Process> {
    if (this.cache.has('process')) {
      return this.cache.get('process');
    }

    try {
      const response = await fetch('/src/content/process.json');
      const data = await response.json();
      const validated = ProcessSchema.parse(data);
      this.cache.set('process', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to load or validate process.json:', error);
      return [];
    }
  }

  static async loadContact(): Promise<Contact> {
    if (this.cache.has('contact')) {
      return this.cache.get('contact');
    }

    try {
      const response = await fetch('/src/content/contact.json');
      const data = await response.json();
      const validated = ContactSchema.parse(data);
      this.cache.set('contact', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to load or validate contact.json:', error);
      return {
        address: '2nd Floor, Business Plaza, Connaught Place, New Delhi - 110001',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.123456789!2d77.2090212!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1234567890',
        email: 'hello@visapro.example',
        phone: '+91 12345 67890',
        whatsapp: '+91 12345 67890',
        officeHours: {
          weekdays: '9:00 AM - 6:00 PM',
          saturday: '10:00 AM - 4:00 PM',
          sunday: 'Closed',
        },
        social: {
          facebook: 'https://facebook.com/visapro',
          instagram: 'https://instagram.com/visapro',
          linkedin: 'https://linkedin.com/company/visapro',
        },
      };
    }
  }

  static async loadFAQs(): Promise<FAQs> {
    if (this.cache.has('faqs')) {
      return this.cache.get('faqs');
    }

    try {
      const response = await fetch('/src/content/faqs.json');
      const data = await response.json();
      const validated = FAQsSchema.parse(data);
      this.cache.set('faqs', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to load or validate faqs.json:', error);
      return { faqs: [] };
    }
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
