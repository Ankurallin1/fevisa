import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { StaticContentLoader } from '../lib/utils/staticContentLoader';
import type { Universities, University } from '../lib/types/site';

export default function Universities() {
  const [universities, setUniversities] = useState<Universities | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedFeeRange, setSelectedFeeRange] = useState('');

  useEffect(() => {
    const data = StaticContentLoader.loadUniversities();
    setUniversities(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!universities) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Universities Not Available</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Filter universities based on search and filters
  const filteredUniversities = universities.filter(university => {
    const matchesSearch = university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         university.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesState = !selectedState || university.location.includes(selectedState);
    
    const matchesFeeRange = !selectedFeeRange || (() => {
      const tuition = university.tuitionRangeAud;
      switch (selectedFeeRange) {
        case 'low':
          return tuition.includes('28,000') || tuition.includes('30,000') || tuition.includes('32,000');
        case 'medium':
          return tuition.includes('35,000') || tuition.includes('38,000') || tuition.includes('40,000') || tuition.includes('42,000');
        case 'high':
          return tuition.includes('45,000') || tuition.includes('48,000') || tuition.includes('50,000') || tuition.includes('52,000') || tuition.includes('55,000') || tuition.includes('58,000') || tuition.includes('60,000') || tuition.includes('65,000');
        default:
          return true;
      }
    })();

    return matchesSearch && matchesState && matchesFeeRange;
  });

  // Get unique states for filter
  const states = Array.from(new Set(universities.map(u => u.location.split(',')[1]?.trim()).filter(Boolean)));

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the best universities in Australia for Indian students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The top universities in Australia for Indian students include University of Melbourne, University of Sydney, Monash University, Australian National University, University of Queensland, University of Western Australia, University of Adelaide, and Deakin University. These universities offer excellent academic programs, strong international student support, and vibrant Indian student communities."
        }
      },
      {
        "@type": "Question",
        "name": "What tuition fees can Indian students expect in Australian universities?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tuition fees for Indian students in Australian universities typically range from A$28,000 to A$65,000 per year, depending on the university and program. Public universities generally offer more affordable options, while prestigious institutions like University of Melbourne and University of Sydney have higher fees but also provide excellent value through their world-class education and strong career outcomes."
        }
      },
      {
        "@type": "Question",
        "name": "Which Australian universities have the best support for Indian students?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All major Australian universities provide excellent support for Indian students, including dedicated international student services, cultural societies, academic support, career guidance, and visa assistance. Universities like Monash University, University of Queensland, and Deakin University are particularly known for their welcoming environment and comprehensive support services for international students."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Top Australian Universities for Indian Students | Study Abroad Guide</title>
        <meta name="description" content="Discover the best Australian universities for Indian students. Compare tuition fees, rankings, and support services. Get expert guidance for your study abroad journey." />
        <meta name="keywords" content="Australian universities, Indian students, study abroad, university rankings, tuition fees, international students" />
        <link rel="canonical" href="https://yourdomain.com/universities" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Top Australian Universities for Indian Students
              </h1>
              <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                Discover the best universities in Australia for Indian students. Compare rankings, 
                tuition fees, and support services to find your perfect academic destination.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Bar */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Universities
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by university name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* State Filter */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by State
                </label>
                <select
                  id="state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Fee Range Filter */}
              <div>
                <label htmlFor="feeRange" className="block text-sm font-medium text-gray-700 mb-2">
                  Tuition Fee Range
                </label>
                <select
                  id="feeRange"
                  value={selectedFeeRange}
                  onChange={(e) => setSelectedFeeRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Ranges</option>
                  <option value="low">Low (A$28,000 - A$35,000)</option>
                  <option value="medium">Medium (A$35,000 - A$45,000)</option>
                  <option value="high">High (A$45,000+)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Universities Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {filteredUniversities.length} Universities Found
            </h2>
            <p className="text-gray-600">
              Explore our curated list of top Australian universities for Indian students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>

          {filteredUniversities.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No universities found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// University Card Component
function UniversityCard({ university }: { university: University }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{university.name}</h3>
          <p className="text-gray-600 text-sm">{university.location}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Tuition Range:</p>
          <p className="text-indigo-600 font-semibold">{university.tuitionRangeAud}</p>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Highlights:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {university.keyHighlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 line-clamp-3">
            {university.bestForIndianStudentsReason}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to={`/universities/${university.slug}`}
            className="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
          >
            View Details
          </Link>
          <a
            href={university.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
          >
            Official Website
          </a>
        </div>
      </div>
    </div>
  );
}