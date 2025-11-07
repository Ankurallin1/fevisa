import { Helmet } from 'react-helmet-async';
import contact from '../content/contact.json';

export default function Contact() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Contact | Free Consultation | Syona Group of Consultants</title>
        <meta name="description" content="Book a free consultation with Syona Group of Consultants. Get expert guidance on Australian universities, admissions, and student visas for Indian students." />
      </Helmet>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Book a Free Consultation</h1>
            <p className="text-gray-700 mb-6">Speak with our student visa experts and plan your study in Australia journey with confidence.</p>
            <div className="space-y-2 text-gray-800">
              <p><strong>Phone:</strong> {contact.phone}</p>
              <p><strong>Email:</strong> {contact.email}</p>
              <p><strong>Address:</strong> {contact.address}</p>
            </div>
            <div className="mt-6 aspect-video w-full rounded-lg overflow-hidden border">
              <iframe title="Map" src={contact.mapEmbedUrl} className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
          <div className="card">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" className="mt-1 w-full border rounded-md px-3 py-2" placeholder="Your name" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" className="mt-1 w-full border rounded-md px-3 py-2" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="tel" className="mt-1 w-full border rounded-md px-3 py-2" placeholder="+91" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Your Goal</label>
                <select className="mt-1 w-full border rounded-md px-3 py-2">
                  <option>Study in Australia</option>
                  <option>Scholarships</option>
                  <option>Visa Consultation (Subclass 500)</option>
                  <option>IELTS / PTE Preparation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea className="mt-1 w-full border rounded-md px-3 py-2" rows={4} placeholder="Tell us about your plans" />
              </div>
              <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700">Request Consultation</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}


