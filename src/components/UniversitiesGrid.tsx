import universities from '../content/universities.json';

export default function UniversitiesGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {universities.map((u) => (
            <a key={u.id} href={u.url} target="_blank" rel="noreferrer" className="card hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">{u.name}</h3>
              <p className="text-gray-600">{u.location}</p>
              <p className="text-sm text-gray-500 mt-2">Tuition: {u.tuitionRangeAud}</p>
              <p className="text-gray-700 mt-3">{u.bestForIndianStudentsReason}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


