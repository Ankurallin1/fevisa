import about from '../content/about.json';

export default function WhyChoose() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{about.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{about.description}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <ul className="space-y-4 text-gray-800">
            <li className="flex items-start gap-3"><span className="text-green-500 mt-1">✓</span><span>Trusted consultants for Indian students</span></li>
            <li className="flex items-start gap-3"><span className="text-green-500 mt-1">✓</span><span>End-to-end support: course to visa to arrival</span></li>
            <li className="flex items-start gap-3"><span className="text-green-500 mt-1">✓</span><span>Transparent, timely, student-first guidance</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}


