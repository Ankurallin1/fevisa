import testimonials from '../content/testimonials.json';

export default function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Student Success Stories</h2>
          <p className="text-gray-600 mt-2">Real journeys, real results</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="card">
              <p className="text-gray-800 text-lg leading-relaxed">“{t.quote}”</p>
              <div className="mt-4 text-sm text-gray-600">— {t.name}, {t.university}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


