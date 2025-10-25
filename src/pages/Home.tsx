import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StaticContentLoader } from '../lib/utils/staticContentLoader';
import type { Hero, Services, Process, FAQs } from '../lib/types/site';
import HeroSection from '../components/Hero';
import ServicesGrid from '../components/ServicesGrid';
import ProcessSteps from '../components/ProcessSteps';
import FAQ from '../components/FAQ';

export default function Home() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [services, setServices] = useState<Services | null>(null);
  const [process, setProcess] = useState<Process | null>(null);
  const [faqs, setFaqs] = useState<FAQs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = () => {
      try {
        const heroData = StaticContentLoader.loadHero();
        const servicesData = StaticContentLoader.loadServices();
        const processData = StaticContentLoader.loadProcess();
        const faqsData = StaticContentLoader.loadFAQs();

        setHero(heroData);
        setServices(servicesData);
        setProcess(processData);
        setFaqs(faqsData);
      } catch (error) {
        console.error('Failed to load content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {hero && <HeroSection {...hero} />}
    

      {process && (
        <section id="how" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Student Journey</h2>
              <p className="text-xl text-gray-600">Our proven 5-step process transforms your dreams into reality</p>
            </div>
            <ProcessSteps steps={process} />
          </div>
        </section>
      )}
      {services && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Complete Education Journey</h2>
              <p className="text-xl text-gray-600">From university discovery to successful settlement - we guide you every step of the way</p>
            </div>
            <ServicesGrid services={services.slice(0, 3)} showAll={false} />
          </div>
        </section>
      )}

      {/* Study Abroad Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Explore Top Australian Universities</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Discover the best universities in Australia specifically chosen for Indian students. 
              Compare rankings, tuition fees, and support services to find your perfect academic destination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/universities"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Browse Universities
              </Link>
              <Link
                to="/book"
                className="bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-400 transition-colors duration-200"
              >
                Get Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {faqs && (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Questions Answered</h2>
              <p className="text-xl text-gray-600">Everything you need to know about studying abroad</p>
            </div>
            <FAQ faqs={faqs.faqs} />
          </div>
        </section>
      )}

      {/* {contact && (
        <section id="contact" className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-xl text-indigo-100">Let's turn your study abroad dreams into reality</p>
            </div>
            <ContactCard {...contact} />
          </div>
        </section>
      )} */}
    </div>
  );
}
