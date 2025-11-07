import { Link } from 'react-router-dom';

export default function ContactCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Study in Australia?</h2>
        <p className="text-blue-100 text-lg mb-8">Talk to our student visa experts today.</p>
        <Link to="/contact" className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
          Book Consultation
        </Link>
      </div>
    </section>
  );
}


