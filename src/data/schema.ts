import { site } from './site';

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const serviceSchema = (name: string, description: string, path: string, offers: string[] = []) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: `${site.url}${path}`,
  provider: { '@id': `${site.url}/#organization` },
  areaServed: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Europe', 'India'],
  ...(offers.length
    ? {
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name,
          itemListElement: offers.map((o) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: o } })),
        },
      }
    : {}),
});
