// The 30-second explainer videos (rendered by scripts/video/render.mjs).
export type Video = { id: string; group: 'Services' | 'Trends'; title: string; description: string; href: string };

export const videos: Video[] = [
  {
    id: 'people',
    group: 'Services',
    title: 'Recruitment & Workforce',
    description: 'How LucidAccuracy briefs, sources, screens and shortlists talent across six markets and eleven industries.',
    href: '/solutions/recruitment-workforce/',
  },
  {
    id: 'technology',
    group: 'Services',
    title: 'Technology Solutions',
    description: 'Software, cloud architecture and data analytics delivered by LucidAccuracy engineering teams.',
    href: '/solutions/technology/',
  },
  {
    id: 'ai',
    group: 'Services',
    title: 'LucidAI Calling Agent',
    description: 'An AI voice agent that answers calls, books appointments and reports every outcome, day and night.',
    href: '/ai-calling-agent/',
  },
  {
    id: 'ai-hiring',
    group: 'Trends',
    title: 'Trend: AI-assisted hiring',
    description: 'AI takes on screening and interview scheduling while recruiters keep the final decision.',
    href: '/solutions/recruitment-workforce/',
  },
  {
    id: 'skills',
    group: 'Trends',
    title: 'Trend: the skills-first workforce',
    description: 'Hiring for skills, closing gaps with training and building teams across six markets.',
    href: '/solutions/training/',
  },
];

export const videoSchema = (v: Video, site: string) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: `${v.title} | LucidAccuracy`,
  description: v.description,
  thumbnailUrl: `${site}/video/${v.id}.jpg`,
  contentUrl: `${site}/video/${v.id}.mp4`,
  uploadDate: '2026-11-12',
  duration: 'PT30S',
  publisher: { '@id': `${site}/#organization` },
});
