import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { ToastContainer } from './components/Toast';
import { StaticContentLoader } from './lib/utils/staticContentLoader';

function App() {
  const site = StaticContentLoader.loadSite();
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.brandName,
    url: 'https://syonaconsultants.com',
    contactPoint: [{ '@type': 'ContactPoint', telephone: site.phone, contactType: 'customer service', email: site.email }],
    sameAs: [site.social.facebook, site.social.instagram, site.social.linkedin].filter(Boolean),
  } as const;

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.brandName,
    address: site.address,
    telephone: site.phone,
    email: site.email,
    areaServed: 'India',
    url: 'https://syonaconsultants.com',
  } as const;
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      </Helmet>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <ToastContainer />
    </div>
  );
}

export default App;
