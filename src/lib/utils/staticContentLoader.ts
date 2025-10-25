import { SiteSchema, HeroSchema, ServicesSchema, ProcessSchema, ContactSchema, FAQsSchema, UniversitiesSchema } from '../types/site';
import type { Site, Hero, Services, Process, Contact, FAQs, Universities } from '../types/site';

// Static imports - these will be bundled at build time
import siteData from '../../content/site.json';
import heroData from '../../content/hero.json';
import servicesData from '../../content/services.json';
import universitiesData from '../../content/universities.json';
import processData from '../../content/process.json';
import contactData from '../../content/contact.json';
import faqsData from '../../content/faqs.json';

// Content loader with static imports and validation
export class StaticContentLoader {
  private static cache = new Map<string, any>();

  static loadSite(): Site {
    if (this.cache.has('site')) {
      return this.cache.get('site');
    }

    try {
      const validated = SiteSchema.parse(siteData);
      this.cache.set('site', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to validate site.json:', error);
      // Return fallback data
      return {
        brandName: 'Acme Migration',
        whatsappNumber: '61123456789',
        email: 'hello@acme.au',
        phone: '+61 123 456 789',
        address: 'Level 2, XYZ Tower, Sydney NSW',
        social: {
          facebook: '#',
          instagram: '#',
          linkedin: '#',
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

  static loadHero(): Hero {
    if (this.cache.has('hero')) {
      return this.cache.get('hero');
    }

    try {
      const validated = HeroSchema.parse(heroData);
      this.cache.set('hero', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to validate hero.json:', error);
      return {
        headline: 'Australia Visa Assistance — Fast, Transparent, Compliant.',
        subheadline: 'Visitor 600, Student 500, TSS 482, Partner 820/801 — expert filing and documentation.',
        primaryCta: { label: 'Book Consultation', href: '/book' },
        secondaryCta: { label: 'Chat on WhatsApp', href: 'whatsapp:auto' },
      };
    }
  }

  static loadServices(): Services {
    if (this.cache.has('services')) {
      return this.cache.get('services');
    }

    try {
      const validated = ServicesSchema.parse(servicesData);
      this.cache.set('services', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to validate services.json:', error);
      return [];
    }
  }

  static loadProcess(): Process {
    if (this.cache.has('process')) {
      return this.cache.get('process');
    }

    try {
      const validated = ProcessSchema.parse(processData);
      this.cache.set('process', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to validate process.json:', error);
      return [];
    }
  }

  static loadContact(): Contact {
    if (this.cache.has('contact')) {
      return this.cache.get('contact');
    }

    try {
      const validated = ContactSchema.parse(contactData);
      this.cache.set('contact', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to validate contact.json:', error);
      return {
        address: 'Level 2, XYZ Tower, Sydney NSW',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.123456789!2d151.2090212!3d-33.8688197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae665e892fdd%3A0x1a0b2b3c4d5e6f7g!2sSydney%20NSW!5e0!3m2!1sen!2sau!4v1234567890',
        email: 'hello@acme.au',
        phone: '+61 123 456 789',
        whatsapp: '+61 123 456 789',
        officeHours: {
          weekdays: '9:00 AM - 6:00 PM',
          saturday: '10:00 AM - 4:00 PM',
          sunday: 'Closed',
        },
        social: {
          facebook: 'https://facebook.com/acme',
          instagram: 'https://instagram.com/acme',
          linkedin: 'https://linkedin.com/company/acme',
        },
      };
    }
  }

  static loadFAQs(): FAQs {
    if (this.cache.has('faqs')) {
      return this.cache.get('faqs');
    }

    try {
      const validated = FAQsSchema.parse(faqsData);
      this.cache.set('faqs', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to validate faqs.json:', error);
      return { faqs: [] };
    }
  }

  static loadUniversities(): Universities {
    if (this.cache.has('universities')) {
      return this.cache.get('universities');
    }

    try {
      const validated = UniversitiesSchema.parse(universitiesData);
      this.cache.set('universities', validated);
      return validated;
    } catch (error) {
      console.warn('Failed to validate universities.json:', error);
      return [];
    }
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
