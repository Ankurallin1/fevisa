import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { StaticContentLoader } from '../lib/utils/staticContentLoader';
import type { Universities, University } from '../lib/types/site';

export default function UniversityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [universities, setUniversities] = useState<Universities | null>(null);
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = StaticContentLoader.loadUniversities();
    setUniversities(data);
    
    if (slug && data) {
      const foundUniversity = data.find(u => u.slug === slug);
      setUniversity(foundUniversity || null);
    }
    
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">University Not Found</h1>
          <p className="text-gray-600 mb-4">The university you're looking for doesn't exist.</p>
          <Link 
            to="/universities" 
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Browse All Universities
          </Link>
        </div>
      </div>
    );
  }

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": university.name,
    "url": university.url,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": university.location.split(',')[0]?.trim(),
      "addressRegion": university.location.split(',')[1]?.trim(),
      "addressCountry": "Australia"
    },
    "description": university.bestForIndianStudentsReason,
    "applicationDeadline": "Varies by program",
    "applicationFee": "A$50-100",
    "tuitionRange": university.tuitionRangeAud
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://yourdomain.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Universities",
        "item": "https://yourdomain.com/universities"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": university.name,
        "item": `https://yourdomain.com/universities/${university.slug}`
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{university.name} - Australian University for Indian Students | Study Abroad Guide</title>
        <meta name="description" content={`Learn about ${university.name} in ${university.location}. Tuition: ${university.tuitionRangeAud}. ${university.bestForIndianStudentsReason.substring(0, 150)}...`} />
        <meta name="keywords" content={`${university.name}, Australian universities, Indian students, study abroad, ${university.location}, tuition fees`} />
        <link rel="canonical" href={`https://yourdomain.com/universities/${university.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-gray-500">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link to="/universities" className="ml-4 text-gray-400 hover:text-gray-500">
                      Universities
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-gray-500 font-medium">{university.name}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{university.name}</h1>
              <p className="text-xl text-indigo-100 mb-6">{university.location}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={university.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Visit Official Website
                </a>
                <Link
                  to="/book"
                  className="bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Why Choose This University */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Choose {university.name} for Indian Students?
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {university.bestForIndianStudentsReason}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Highlights</h2>
                <ul className="space-y-3">
                  {university.keyHighlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-500 mr-3 mt-1">•</span>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Application Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Application Deadlines</h3>
                    <p className="text-gray-700">Varies by program (typically February/March for Semester 1, July/August for Semester 2)</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Application Fee</h3>
                    <p className="text-gray-700">A$50-100 (varies by program)</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">English Requirements</h3>
                    <p className="text-gray-700">IELTS 6.5-7.0 or equivalent</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Academic Requirements</h3>
                    <p className="text-gray-700">12th grade with 70-85% (varies by program)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Tuition Information */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tuition Fees</h3>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600 mb-2">{university.tuitionRangeAud}</p>
                  <p className="text-sm text-gray-600">Per year (AUD)</p>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p className="mb-2">• Fees vary by program</p>
                  <p className="mb-2">• Additional costs for accommodation, living expenses</p>
                  <p>• Scholarships and financial aid available</p>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700">Location:</span>
                    <p className="text-gray-600">{university.location}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">International Students:</span>
                    <p className="text-gray-600">Large community</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Indian Student Support:</span>
                    <p className="text-gray-600">Excellent</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help with Applications?</h3>
                <p className="text-gray-700 mb-4">
                  Get expert guidance for your university application process.
                </p>
                <Link
                  to="/book"
                  className="w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium block"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Universities */}
        {universities && (
          <div className="bg-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Other Top Universities for Indian Students
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {universities
                  .filter(u => u.id !== university.id)
                  .slice(0, 3)
                  .map((relatedUniversity) => (
                    <div key={relatedUniversity.id} className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{relatedUniversity.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{relatedUniversity.location}</p>
                      <p className="text-indigo-600 font-semibold text-sm mb-4">{relatedUniversity.tuitionRangeAud}</p>
                      <Link
                        to={`/universities/${relatedUniversity.slug}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
