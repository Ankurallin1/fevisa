import { Link } from 'react-router-dom';
import type { Hero } from '../lib/types/site';
import { analytics } from '../lib/utils/analytics';

interface HeroProps extends Hero {}

export default function Hero({ headline, subheadline, primaryCta, secondaryCta }: HeroProps) {
  const handleBookClick = () => {
    analytics.bookClick('hero');
  };

  const handleWhatsAppClick = () => {
    analytics.whatsappClick('hero');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-400/20 rounded-full blur-lg"></div>
      
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6">
              🌍 Your Global Education Journey Starts Here
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {headline}
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to={primaryCta.href}
                onClick={handleBookClick}
                className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {primaryCta.label}
              </Link>
              
              {secondaryCta.href === 'whatsapp:auto' ? (
                <button
                  onClick={handleWhatsAppClick}
                  className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 hover:scale-105"
                >
                  {secondaryCta.label}
                </button>
              ) : (
                <Link
                  to={secondaryCta.href}
                  onClick={handleWhatsAppClick}
                  className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 hover:scale-105"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Free Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>95% Success Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">🎓</div>
                  <div className="text-sm font-semibold">University Selection</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="text-sm font-semibold">Admission Support</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">✈️</div>
                  <div className="text-sm font-semibold">Visa Processing</div>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">🏠</div>
                  <div className="text-sm font-semibold">Settlement Support</div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
