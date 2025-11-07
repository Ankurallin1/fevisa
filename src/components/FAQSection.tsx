import { Helmet } from 'react-helmet-async';
import faqsData from '../content/faqs.json';
import FAQ from './FAQ';

export default function FAQSection() {
  const faqs = faqsData.faqs;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } as const;

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Student Questions Answered</h2>
          <p className="text-xl text-gray-600">Everything about studying in Australia</p>
        </div>
        <FAQ faqs={faqs} />
      </div>
    </section>
  );
}


