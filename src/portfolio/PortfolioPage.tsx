import { lazy, Suspense, useEffect } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Metrics } from './components/Metrics';
import { PERSON, SITE } from './config';

const About = lazy(() => import('./components/About').then((m) => ({ default: m.About })));
const Timeline = lazy(() => import('./components/Timeline').then((m) => ({ default: m.Timeline })));
const Certifications = lazy(() => import('./components/Certifications').then((m) => ({ default: m.Certifications })));
const Services = lazy(() => import('./components/Services').then((m) => ({ default: m.Services })));
const Contact = lazy(() => import('./components/Contact').then((m) => ({ default: m.Contact })));
const Footer = lazy(() => import('./components/Footer').then((m) => ({ default: m.Footer })));

const SectionSkeleton = () => (
  <div className="py-20 bg-brand-bg">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-8 w-48 bg-brand-surface rounded-lg animate-pulse mb-4" />
      <div className="h-4 w-96 bg-brand-surface rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-brand-surface rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: PERSON.name,
  url: SITE.url,
  image: `${SITE.url}${PERSON.headshot}`,
  jobTitle: PERSON.title,
  description: SITE.description,
  worksFor: { '@type': 'Organization', name: 'Kuvanta Tech', url: PERSON.website },
  address: { '@type': 'PostalAddress', addressLocality: 'Kuala Lumpur', addressCountry: 'MY' },
  email: PERSON.email,
  telephone: PERSON.phone,
  sameAs: [PERSON.linkedin, PERSON.website],
  knowsAbout: ['Project Management', 'Programme Delivery', 'SAFe Agile', 'Digital Transformation', 'MAS Regulatory Compliance', 'Payments Ecosystems', 'Microservices Architecture', 'AI Delivery Consulting'],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', name: 'PMP® — Project Management Professional', credentialCategory: 'Certification', recognizedBy: { '@type': 'Organization', name: 'Project Management Institute' } },
    { '@type': 'EducationalOccupationalCredential', name: 'PSM I — Professional Scrum Master', credentialCategory: 'Certification', recognizedBy: { '@type': 'Organization', name: 'Scrum.org' } },
    { '@type': 'EducationalOccupationalCredential', name: 'CSPO® — Certified Scrum Product Owner', credentialCategory: 'Certification', recognizedBy: { '@type': 'Organization', name: 'Scrum Alliance' } },
  ],
};

const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Kuvanta — IT PM & AI Delivery Advisory',
  url: 'https://kuvanta.tech',
  description: 'Independent IT programme management and AI delivery consulting. Services include programme rescue, SAFe coaching, fractional Delivery Manager, and AI-augmented delivery consulting.',
  provider: { '@type': 'Person', name: 'Nagarajan Maheswaran' },
  areaServed: ['Malaysia', 'Singapore', 'APAC', 'Global'],
  serviceType: ['Programme Rescue & Recovery', 'SAFe Agile Transformation', 'Fractional Delivery Manager', 'AI Delivery Consulting'],
  address: { '@type': 'PostalAddress', addressLocality: 'Kuala Lumpur', addressCountry: 'MY' },
};

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nagarajan.kuvanta.tech/' },
    { '@type': 'ListItem', position: 2, name: 'Experience', item: 'https://nagarajan.kuvanta.tech/#experience' },
    { '@type': 'ListItem', position: 3, name: 'Services', item: 'https://nagarajan.kuvanta.tech/#services' },
    { '@type': 'ListItem', position: 4, name: 'Contact', item: 'https://nagarajan.kuvanta.tech/#contact' },
  ],
};

function injectSchema(id: string, data: object) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    (el as HTMLScriptElement).type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function PortfolioPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = SITE.title;
    injectSchema('schema-person', PERSON_SCHEMA);
    injectSchema('schema-service', SERVICE_SCHEMA);
    injectSchema('schema-breadcrumb', BREADCRUMB_SCHEMA);
    return () => {
      document.title = prev;
      ['schema-person', 'schema-service', 'schema-breadcrumb'].forEach((id) => {
        document.getElementById(id)?.remove();
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <Nav />
      <main>
        <Hero />
        <Metrics />
        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Timeline />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Certifications />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Services />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-20 bg-brand-bg border-t border-brand-border" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
