// Single source of truth for LucidAccuracy site content.
// Every claim here should be verified by the company before publishing.

export const site = {
  name: 'LucidAccuracy',
  url: 'https://lucidaccuracy.com',
  tagline: 'Global Workforce, Technology & Business Solutions',
  positioning:
    'LucidAccuracy is a global workforce, technology and AI solutions company helping organizations worldwide build teams, solve technology challenges and automate business operations.',
  description:
    'LucidAccuracy is a global workforce, technology and business solutions company supporting organizations across the United States, Canada, UK, Australia, Europe and India.',
  email: 'Info@lucidaccuracy.com',
  phone: '+1 307-999-9564',
  phoneHref: 'tel:+13079999564',
  // Add verified profiles here; the footer renders whatever is listed.
  social: [] as { label: string; url: string }[],
};

// Actual office / registered locations. The brief mentions five U.S. addresses;
// three have been supplied so far. Add the remaining two here once confirmed.
export const locations = [
  {
    state: 'California',
    city: 'Sacramento',
    lines: ['1401 21st St, Ste R', 'Sacramento, CA 95811'],
    street: '1401 21st St, Ste R',
    locality: 'Sacramento',
    region: 'CA',
    postal: '95811',
    lat: 38.5735,
    lon: -121.4759,
  },
  {
    state: 'Connecticut',
    city: 'Glastonbury',
    lines: ['2389 Main St, Ste 100', 'Glastonbury, CT 06033'],
    street: '2389 Main St, Ste 100',
    locality: 'Glastonbury',
    region: 'CT',
    postal: '06033',
    lat: 41.7123,
    lon: -72.6081,
  },
  {
    state: 'Ohio',
    city: 'Canton',
    lines: ['6545 Market Ave North, Ste 100', 'Canton, OH 44721'],
    street: '6545 Market Ave North, Ste 100',
    locality: 'Canton',
    region: 'OH',
    postal: '44721',
    lat: 40.8759,
    lon: -81.3653,
  },
];

// Markets served. These are not office locations.
export const markets = [
  { code: 'us', name: 'United States', short: 'USA', lat: 39.5, lon: -98.5, note: 'Workforce, technology and AI delivery, with offices in California, Connecticut and Ohio.' },
  { code: 'ca', name: 'Canada', short: 'Canada', lat: 55, lon: -106, note: 'Recruitment and technology support for Canadian employers and project teams.' },
  { code: 'gb', name: 'United Kingdom', short: 'UK', lat: 53.5, lon: -1.8, note: 'Talent and technology engagements shaped around UK hiring practice.' },
  { code: 'eu', name: 'Europe', short: 'Europe', lat: 49.5, lon: 11, note: 'Cross-border workforce and digital delivery for organizations across the region.' },
  { code: 'in', name: 'India', short: 'India', lat: 21.5, lon: 79, note: 'Technology talent, delivery capacity and business process support.' },
  { code: 'au', name: 'Australia', short: 'Australia', lat: -25, lon: 134, note: 'Workforce and technology support for Australian organizations.' },
];

export type Solution = {
  slug: string;
  nav: string;
  title: string;
  icon: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  services: { name: string; text: string }[];
  approach: { name: string; text: string }[];
  faqs: { q: string; a: string }[];
};

export const solutions: Solution[] = [
  {
    slug: 'recruitment-workforce',
    nav: 'Recruitment & Workforce',
    title: 'Recruitment & Workforce Solutions',
    icon: 'Users',
    summary:
      'We help organizations identify, engage and deploy qualified professionals across industries through flexible workforce and recruitment solutions tailored to regional business requirements.',
    metaTitle: 'Recruitment & Workforce Solutions | LucidAccuracy',
    metaDescription:
      'Discover global recruitment and workforce solutions from LucidAccuracy across technology, healthcare, engineering, finance, life sciences and other industries.',
    lead: 'Permanent, contract and flexible hiring for teams in six markets, run by recruiters who know the roles they fill.',
    services: [
      { name: 'Permanent Recruitment', text: 'Search and selection for roles you intend to keep, from first brief to accepted offer.' },
      { name: 'Contract Staffing', text: 'Skilled professionals for defined projects and fixed terms, onboarded and ready to start.' },
      { name: 'Temporary & Flexible Workforce', text: 'Short-notice cover and seasonal capacity that scales up or down with demand.' },
      { name: 'Executive & Specialized Hiring', text: 'Discreet search for leadership posts and hard-to-find specialist skills.' },
      { name: 'Workforce Management', text: 'Onboarding, timesheets and day-to-day coordination for the people we place.' },
      { name: 'Recruitment Process Support', text: 'Sourcing, screening and scheduling capacity added to your in-house hiring team.' },
      { name: 'Talent Acquisition Support', text: 'Market mapping, pipelines and employer positioning for roles you hire often.' },
    ],
    approach: [
      { name: 'Brief', text: 'We agree the role, the must-haves, the budget and the regional hiring rules that apply.' },
      { name: 'Source', text: 'Recruiters search our network and the open market, then screen every candidate by conversation.' },
      { name: 'Select', text: 'You interview a short list. We handle scheduling, feedback and offer management.' },
      { name: 'Deploy', text: 'We support onboarding and stay in contact through the first months of the placement.' },
    ],
    faqs: [
      { q: 'Which industries does LucidAccuracy recruit for?', a: 'LucidAccuracy recruits across technology and IT, healthcare, engineering, finance and accounting, pharmaceutical and life sciences, manufacturing, logistics, telecommunications, retail, energy and professional services.' },
      { q: 'Which countries does LucidAccuracy support for hiring?', a: 'LucidAccuracy supports organizations hiring in the United States, Canada, the United Kingdom, Australia, Europe and India. Engagement terms follow the hiring practice of each market.' },
      { q: 'Does LucidAccuracy offer C2C, W2 and contract-to-hire engagements?', a: 'Yes. For roles based in the United States, LucidAccuracy supports Corp-to-Corp (C2C), W2 and Contract-to-Hire (C2H) engagement models.' },
    ],
  },
  {
    slug: 'technology',
    nav: 'Technology Solutions',
    title: 'Technology Solutions',
    icon: 'Code',
    summary:
      'Software, cloud, data and security work delivered by our own engineering teams, from a single application to a full digital transformation program.',
    metaTitle: 'Technology Solutions | LucidAccuracy',
    metaDescription:
      'Explore LucidAccuracy technology solutions across software development, cloud, data, AI, automation and digital transformation.',
    lead: 'We design, build and run technology for clients. Technology staffing is a separate service; this is delivery.',
    services: [
      { name: 'Software & Application Development', text: 'Web and business applications built on modern frameworks, with design, testing and release included.' },
      { name: 'Cloud Solutions', text: 'Cloud architecture, migration and cost control on the platform your team already uses.' },
      { name: 'Data & Analytics', text: 'Pipelines, warehouses and dashboards that turn operational data into numbers people trust.' },
      { name: 'AI & Automation', text: 'Voice agents, workflow automation and AI features added to the systems you already run.' },
      { name: 'Cybersecurity', text: 'Security reviews, access controls and hardening for applications and infrastructure.' },
      { name: 'Digital Transformation', text: 'Roadmaps and delivery for replacing manual processes and ageing systems.' },
      { name: 'Managed IT & Technology Support', text: 'Ongoing monitoring, maintenance and support for the systems we build, where applicable.' },
    ],
    approach: [
      { name: 'Discover', text: 'We map your goals, users and constraints, and agree a scope both sides can measure.' },
      { name: 'Design', text: 'Architects and designers define the solution, the stack and the delivery plan.' },
      { name: 'Deliver', text: 'Engineers ship in short cycles with working software to review at every milestone.' },
      { name: 'Support', text: 'We hand over cleanly or stay on to run, monitor and improve what we built.' },
    ],
    faqs: [
      { q: 'Does LucidAccuracy build software or only supply technology staff?', a: 'Both. LucidAccuracy delivers technology projects with its own teams, including software development, cloud, data, AI and cybersecurity work, and separately provides technology recruitment for clients who want to hire.' },
      { q: 'What technology services does LucidAccuracy provide?', a: 'LucidAccuracy provides software and application development, cloud solutions, data and analytics, AI and automation, cybersecurity, digital transformation and, where applicable, managed IT support.' },
    ],
  },
  {
    slug: 'training',
    nav: 'Training & Development',
    title: 'Training & Professional Development',
    icon: 'GraduationCap',
    summary:
      'Corporate and technology training that gives teams current, job-ready skills, with certification support where it applies.',
    metaTitle: 'Training & Professional Development | LucidAccuracy',
    metaDescription:
      'Corporate training, technology training, upskilling and reskilling programs from LucidAccuracy, with certification support and hands-on, real-world projects.',
    lead: 'Programs built around the tools and roles your people work with, taught through hands-on projects.',
    services: [
      { name: 'Corporate Training', text: 'Programs for teams and departments, scheduled around the working week.' },
      { name: 'Technology Training', text: 'Instructor-led courses in software, cloud, data and security with labs that mirror real work.' },
      { name: 'Upskilling & Reskilling', text: 'Structured paths that move existing staff into new tools or new roles.' },
      { name: 'Professional Development', text: 'Communication, presentation and workplace-readiness coaching for client-facing roles.' },
      { name: 'Certification Support', text: 'Study plans and practice exams for recognized certifications, where applicable.' },
    ],
    approach: [
      { name: 'Assess', text: 'We review current skills against the roles and tools your team needs next.' },
      { name: 'Plan', text: 'A curriculum is set with you: topics, format, schedule and how progress is measured.' },
      { name: 'Train', text: 'Instructors teach through projects and labs drawn from real workplace scenarios.' },
      { name: 'Apply', text: 'Learners finish with work they can show, plus interview and career guidance where relevant.' },
    ],
    faqs: [
      { q: 'What training programs does LucidAccuracy offer?', a: 'LucidAccuracy offers corporate training, technology training, upskilling and reskilling programs, professional development coaching and certification support where applicable.' },
      { q: 'Is LucidAccuracy training available for individuals or only companies?', a: 'Programs are designed for corporate teams and for individual professionals who want job-ready technology skills. Contact the team to discuss the right format.' },
    ],
  },
  {
    slug: 'consulting',
    nav: 'Consulting',
    title: 'Consulting & Professional Services',
    icon: 'Compass',
    summary:
      'Workforce, technology and transformation advice from people who also deliver the work they recommend.',
    metaTitle: 'Consulting & Professional Services | LucidAccuracy',
    metaDescription:
      'Workforce consulting, technology consulting and business transformation services from LucidAccuracy for organizations planning growth, change or new capabilities.',
    lead: 'Clear recommendations, a costed plan and a team that can stay to carry it out.',
    services: [
      { name: 'Workforce Consulting', text: 'Team structure, hiring plans and workforce models for growth or change.' },
      { name: 'Technology Consulting', text: 'Platform choices, architecture reviews and build-or-buy decisions explained in plain terms.' },
      { name: 'Business Transformation', text: 'Program planning and delivery support when processes, systems and roles change together.' },
    ],
    approach: [
      { name: 'Listen', text: 'We start with your objectives and the constraints your teams work under today.' },
      { name: 'Assess', text: 'Consultants review people, process and systems, and report what they find.' },
      { name: 'Recommend', text: 'You receive options with costs, risks and a sequence you can act on.' },
      { name: 'Implement', text: 'Our workforce and technology teams can carry out the plan alongside yours.' },
    ],
    faqs: [
      { q: 'What consulting services does LucidAccuracy provide?', a: 'LucidAccuracy provides workforce consulting, technology consulting and business transformation services, and can supply the delivery teams to implement its recommendations.' },
    ],
  },
  {
    slug: 'business-process',
    nav: 'Business Process Solutions',
    title: 'Business Process Solutions',
    icon: 'Workflow',
    summary:
      'Back-office, customer support and process management teams that take routine operations off your desk.',
    metaTitle: 'Business Process Solutions | LucidAccuracy',
    metaDescription:
      'Back-office operations, customer support, process management and business support services from LucidAccuracy, delivered by dedicated or project-based teams.',
    lead: 'Dedicated or project-based teams that run defined processes to agreed service levels.',
    services: [
      { name: 'Back-office Operations', text: 'Data entry, document processing and administrative work handled to an agreed standard.' },
      { name: 'Customer Support', text: 'Support teams for phone, email and chat, working to your scripts and service levels.' },
      { name: 'Process Management', text: 'Workflow analysis, documentation and continuous improvement for recurring processes.' },
      { name: 'Business Support', text: 'Flexible operational capacity for finance, HR and administrative functions.' },
    ],
    approach: [
      { name: 'Map', text: 'We document the process as it runs today, with volumes, systems and exceptions.' },
      { name: 'Transition', text: 'Work moves to our team in stages, with your staff signing off each one.' },
      { name: 'Operate', text: 'The team runs the process and reports against the service levels we agreed.' },
      { name: 'Improve', text: 'Regular reviews remove rework and introduce automation where it pays back.' },
    ],
    faqs: [
      { q: 'What business processes can LucidAccuracy manage?', a: 'LucidAccuracy manages back-office operations, customer support, process management and general business support, using dedicated teams or project-based engagements.' },
    ],
  },
];

export const pillars = [
  {
    key: 'people',
    label: 'People',
    title: 'Global Recruitment & Workforce Solutions',
    text: 'Permanent, contract and flexible hiring across eleven industries, shaped to the hiring practice of each market.',
    href: '/solutions/recruitment-workforce/',
    cta: 'See workforce solutions',
    points: ['Permanent recruitment', 'Contract staffing', 'Executive & specialized hiring', 'Workforce management'],
  },
  {
    key: 'technology',
    label: 'Technology',
    title: 'Technology & Digital Solutions',
    text: 'Software, cloud, data and security projects delivered by our own engineers, from first workshop to live system.',
    href: '/solutions/technology/',
    cta: 'See technology solutions',
    points: ['Software development', 'Cloud solutions', 'Data & analytics', 'Cybersecurity'],
  },
  {
    key: 'ai',
    label: 'AI',
    title: 'AI Products & Business Automation',
    text: 'LucidAI Calling Agent answers and places phone calls, qualifies leads and books appointments around the clock.',
    href: '/ai-calling-agent/',
    cta: 'See the AI Calling Agent',
    points: ['Inbound & outbound calling', 'Lead qualification', 'Appointment scheduling', 'Call analytics'],
  },
];

export const industries = [
  { slug: 'technology-it', name: 'Technology & IT', icon: 'Cpu', text: 'Software, cloud, cybersecurity, data, AI/ML, DevOps, infrastructure and enterprise technology roles.', roles: ['Software', 'Cloud', 'Cybersecurity', 'Data', 'AI/ML', 'DevOps', 'Infrastructure'] },
  { slug: 'healthcare', name: 'Healthcare & Medical', icon: 'HeartPulse', text: 'Healthcare operations, clinical and non-clinical talent, administration and healthcare technology.', roles: ['Clinical talent', 'Non-clinical talent', 'Operations', 'Administration', 'Health technology'] },
  { slug: 'engineering', name: 'Engineering & Technical', icon: 'DraftingCompass', text: 'Mechanical, electrical, civil, manufacturing, industrial, quality, process and other engineering roles.', roles: ['Mechanical', 'Electrical', 'Civil', 'Industrial', 'Quality', 'Process'] },
  { slug: 'finance', name: 'Finance & Accounting', icon: 'Landmark', text: 'Financial analysis, accounting, audit, banking, insurance and related functions.', roles: ['Financial analysis', 'Accounting', 'Audit', 'Banking', 'Insurance'] },
  { slug: 'life-sciences', name: 'Pharmaceutical & Life Sciences', icon: 'FlaskConical', text: 'Pharmaceutical, biotechnology, laboratory, quality and regulatory functions.', roles: ['Pharmaceutical', 'Biotechnology', 'Laboratory', 'Quality', 'Regulatory'] },
  { slug: 'manufacturing', name: 'Manufacturing & Industrial', icon: 'Factory', text: 'Production, plant operations, maintenance and industrial management teams.', roles: ['Production', 'Plant operations', 'Maintenance', 'Supervision'] },
  { slug: 'logistics', name: 'Logistics & Supply Chain', icon: 'Truck', text: 'Warehousing, transport, planning and procurement roles that keep goods moving.', roles: ['Warehousing', 'Transport', 'Planning', 'Procurement'] },
  { slug: 'telecom', name: 'Telecommunications', icon: 'RadioTower', text: 'Network engineering, field operations and telecom project delivery.', roles: ['Network engineering', 'Field operations', 'Project delivery'] },
  { slug: 'retail', name: 'Retail & E-commerce', icon: 'ShoppingBag', text: 'Store operations, merchandising, digital commerce and customer service teams.', roles: ['Store operations', 'Merchandising', 'Digital commerce', 'Customer service'] },
  { slug: 'energy', name: 'Energy', icon: 'Zap', text: 'Technical, project and operations talent for energy producers and utilities.', roles: ['Technical', 'Projects', 'Operations', 'Utilities'] },
  { slug: 'professional-services', name: 'Business & Professional Services', icon: 'Briefcase', text: 'HR, operations, sales, marketing, administration, customer support and project management.', roles: ['HR', 'Operations', 'Sales', 'Marketing', 'Administration', 'Customer support', 'Project management'] },
];

export const techCapabilities = [
  { name: 'Software & Application Development', short: 'Software', icon: 'Code', text: 'Web and business applications, designed, built, tested and released.' },
  { name: 'Cloud Solutions', short: 'Cloud', icon: 'Cloud', text: 'Architecture, migration and cost control on the major cloud platforms.' },
  { name: 'Data & Analytics', short: 'Data', icon: 'ChartColumn', text: 'Pipelines, warehouses and dashboards for decisions made on real numbers.' },
  { name: 'AI & Automation', short: 'AI', icon: 'Sparkles', text: 'Voice agents, workflow automation and AI features inside existing systems.' },
  { name: 'Cybersecurity', short: 'Security', icon: 'ShieldCheck', text: 'Security reviews, access control and hardening for apps and infrastructure.' },
  { name: 'Digital Transformation', short: 'Transformation', icon: 'RefreshCw', text: 'Roadmaps and delivery for replacing manual work and ageing systems.' },
  { name: 'Managed IT & Technology Support', short: 'Support', icon: 'LifeBuoy', text: 'Monitoring, maintenance and support, where applicable.' },
];

export const whyUs = [
  { name: 'Global Reach', text: 'One partner for hiring and delivery across the United States, Canada, the UK, Australia, Europe and India.' },
  { name: 'Cross-Industry Expertise', text: 'Recruiters and consultants who work across eleven industries, from healthcare to energy.' },
  { name: 'Technology & AI Capabilities', text: 'Engineering teams that ship software, and an AI calling product we build ourselves.' },
  { name: 'Flexible Workforce Solutions', text: 'Permanent, contract and temporary models, matched to the role and the market.' },
  { name: 'End-to-End Business Support', text: 'Talent, technology, training and operations from a single accountable team.' },
  { name: 'Client-Focused Delivery', text: 'A named contact, agreed milestones and progress you can check at every stage.' },
  { name: 'Regional Understanding with Global Capability', text: 'Local hiring practice and business norms, backed by international delivery capacity.' },
];

export const agent = {
  name: 'LucidAI Calling Agent',
  hero: 'Meet Your AI Calling Agent',
  sub: 'Human-like conversations. Automated at scale.',
  description:
    "LucidAccuracy's AI Calling Agent enables businesses to automate inbound and outbound phone conversations using intelligent AI voice technology. The agent can interact with customers, qualify leads, schedule appointments, answer frequently asked questions, follow up with prospects and support business operations 24/7.",
  capabilities: [
    { name: 'Inbound & Outbound Calling', icon: 'PhoneCall', text: 'Answers incoming calls and places outgoing ones from the same agent.' },
    { name: 'AI-Powered Natural Conversations', icon: 'AudioLines', text: 'Speaks in a natural voice and handles interruptions and follow-up questions.' },
    { name: 'Lead Qualification', icon: 'Funnel', text: 'Asks your qualifying questions and passes on the leads that fit.' },
    { name: 'Appointment Scheduling', icon: 'CalendarCheck', text: 'Offers available times and books the slot during the call.' },
    { name: 'Automated Follow-Ups', icon: 'Repeat', text: 'Calls back prospects and customers on the schedule you set.' },
    { name: 'Multilingual Conversations', icon: 'Languages', text: 'Holds conversations in more than one language, where supported.' },
    { name: 'Call Analytics & Reporting', icon: 'ChartColumn', text: 'Records outcomes, durations and transcripts for every call.' },
    { name: 'CRM & Business System Integrations', icon: 'Blocks', text: 'Writes results to your CRM and calendar, where supported.' },
    { name: '24/7 Availability', icon: 'Clock', text: 'Takes calls at night, at weekends and on public holidays.' },
  ],
  steps: [
    { name: 'Define the call', text: 'We set the goal, the script, the questions to ask and the rules for handing over to a person.' },
    { name: 'Connect your systems', text: 'The agent is linked to your phone number and, where supported, your CRM and calendar.' },
    { name: 'Go live on calls', text: 'The agent answers and places calls, speaks naturally and completes the task you gave it.' },
    { name: 'Review every outcome', text: 'Transcripts, outcomes and call statistics arrive in a report your team can act on.' },
  ],
  useCases: [
    { name: 'Healthcare', icon: 'HeartPulse', text: 'Appointment reminders, scheduling and follow-ups.' },
    { name: 'Recruitment', icon: 'Users', text: 'Candidate screening, interview scheduling and candidate follow-ups.' },
    { name: 'Real Estate', icon: 'Building', text: 'Lead qualification, inquiries and appointment scheduling.' },
    { name: 'Education', icon: 'GraduationCap', text: 'Student inquiries, admissions follow-ups and scheduling.' },
    { name: 'Financial Services', icon: 'Landmark', text: 'Customer follow-ups and appointment or service inquiries.' },
    { name: 'Retail & E-commerce', icon: 'ShoppingBag', text: 'Customer communication and support workflows.' },
    { name: 'Professional Services', icon: 'Briefcase', text: 'Lead qualification, customer communication and appointments.' },
    { name: 'Sales & Marketing', icon: 'Megaphone', text: 'Lead generation, outbound campaigns and follow-ups.' },
  ],
  integrations: [
    { name: 'CRM platforms', icon: 'Database', text: 'Contacts, leads and call outcomes written to your records.' },
    { name: 'Calendars & booking', icon: 'CalendarDays', text: 'Live availability checked and appointments booked.' },
    { name: 'Telephony', icon: 'Phone', text: 'Your existing business numbers, inbound and outbound.' },
    { name: 'Business systems', icon: 'Blocks', text: 'Helpdesk, applicant tracking and internal tools.' },
  ],
  security: [
    { name: 'Disclosure', text: 'The agent can state that the caller is speaking with an AI assistant, in line with your policy.' },
    { name: 'Human handover', text: 'Calls are passed to your staff whenever the caller asks or your rules require it.' },
    { name: 'Data handling', text: 'Recording, retention and access settings are agreed with you before the agent goes live.' },
    { name: 'Consent & compliance', text: 'Call scripts and schedules are configured around the calling rules of each market you operate in.' },
  ],
  faqs: [
    { q: 'What is the LucidAI Calling Agent?', a: 'LucidAI Calling Agent is an AI voice product from LucidAccuracy that automates inbound and outbound phone conversations. It can talk with customers, qualify leads, schedule appointments, answer frequently asked questions and follow up with prospects 24 hours a day.' },
    { q: 'What can the AI Calling Agent do on a call?', a: 'The agent can answer and place calls, hold a natural conversation, ask qualifying questions, book appointments, answer common questions, follow up with prospects and record the outcome of each call.' },
    { q: 'Which industries use an AI calling agent?', a: 'Common uses include healthcare appointment reminders, recruitment screening and interview scheduling, real estate lead qualification, education admissions follow-ups, financial services inquiries, retail customer communication, professional services and outbound sales campaigns.' },
    { q: 'Does the AI Calling Agent integrate with a CRM?', a: 'CRM and business system integrations are available where supported. During setup the LucidAccuracy team confirms which of your systems the agent can connect to.' },
    { q: 'Can the agent speak more than one language?', a: 'Multilingual conversations are available where supported. Tell the team which languages your callers use and they will confirm coverage during the demo.' },
    { q: 'Can a caller reach a person instead of the AI agent?', a: 'Yes. The agent hands the call to your staff whenever the caller asks or when the rules you set require it.' },
    { q: 'How do I see a demo of the AI Calling Agent?', a: 'Use the Book a Demo form on the LucidAccuracy contact page, email Info@lucidaccuracy.com or call +1 307-999-9564. The AI team will arrange a live demonstration based on your use case.' },
  ],
};

// Scripted demonstration calls shown in the product UI. They illustrate the
// agent's behaviour; the businesses and people are fictional.
export const callScenarios = [
  {
    key: 'healthcare',
    label: 'Healthcare',
    business: 'Riverside Family Clinic',
    task: 'Appointment reminder',
    outcome: 'Appointment rescheduled',
    lines: [
      ['agent', 'Hello, this is the automated assistant for Riverside Family Clinic. Am I speaking with Daniel?'],
      ['caller', 'Yes, this is Daniel.'],
      ['agent', 'You have a check-up on Thursday at 10:30. Would you like to keep that time?'],
      ['caller', 'Could we move it to the afternoon?'],
      ['agent', 'Of course. I have 2:15 or 4:00 on Thursday. Which suits you?'],
      ['caller', '2:15 works.'],
      ['agent', 'Done. Thursday at 2:15 is booked and a confirmation text is on its way.'],
    ],
  },
  {
    key: 'recruitment',
    label: 'Recruitment',
    business: 'Talent desk',
    task: 'Candidate screening',
    outcome: 'Interview scheduled',
    lines: [
      ['agent', 'Hi Priya, I am the AI assistant calling about your application for the data analyst role. Is now a good time?'],
      ['caller', 'Sure, go ahead.'],
      ['agent', 'How many years have you worked with SQL and dashboards?'],
      ['caller', 'About four years, mostly SQL and Power BI.'],
      ['agent', 'Thank you. Are you available to start within thirty days?'],
      ['caller', 'Yes, I can.'],
      ['agent', 'Great. A recruiter can meet you Tuesday at 11:00. I have sent the invitation.'],
    ],
  },
  {
    key: 'real-estate',
    label: 'Real Estate',
    business: 'Harbor Street Realty',
    task: 'Lead qualification',
    outcome: 'Viewing booked',
    lines: [
      ['caller', 'Hi, I saw the listing on Maple Avenue. Is it still available?'],
      ['agent', 'It is. I am the AI assistant for Harbor Street Realty. Are you looking to buy or to rent?'],
      ['caller', 'To buy. We are hoping to move by spring.'],
      ['agent', 'Understood. Do you have financing arranged, or would an introduction to a lender help?'],
      ['caller', 'We are pre-approved.'],
      ['agent', 'Excellent. An agent can show the home Saturday at 10:00 or 1:30.'],
      ['caller', 'Saturday at 10:00, please.'],
    ],
  },
] as const;

// Placeholder case studies. Replace each with a verified, approved project
// before launch. Outcomes are intentionally left unquantified.
export const projects = [
  {
    slug: 'healthcare-technology-transformation',
    title: 'Healthcare Technology Transformation',
    market: 'United States',
    industry: 'Healthcare & Medical',
    pillar: 'Technology',
    challenge: 'A healthcare provider needed to replace paper-based scheduling and intake across several clinics.',
    solution: 'LucidAccuracy designed and built a web-based scheduling and intake platform, then trained clinic staff to use it.',
    services: ['Software development', 'Cloud solutions', 'Corporate training'],
    scope: 'Discovery, design, build, rollout and staff training.',
  },
  {
    slug: 'engineering-workforce-program',
    title: 'Engineering Workforce Program',
    market: 'Canada',
    industry: 'Engineering & Technical',
    pillar: 'People',
    challenge: 'An industrial firm had to staff a multi-site project with engineers in several disciplines on a fixed timeline.',
    solution: 'LucidAccuracy ran a dedicated contract staffing program with ongoing workforce management for the placed team.',
    services: ['Contract staffing', 'Workforce management', 'Recruitment process support'],
    scope: 'Sourcing, screening, onboarding and workforce coordination.',
  },
  {
    slug: 'ai-calling-for-appointment-scheduling',
    title: 'AI Calling for Appointment Scheduling',
    market: 'United States',
    industry: 'Professional Services',
    pillar: 'AI',
    challenge: 'A service business was missing inbound calls outside office hours and losing bookings to slow follow-up.',
    solution: 'LucidAI Calling Agent was configured to answer inquiries, qualify callers and book appointments at any hour.',
    services: ['LucidAI Calling Agent', 'Calendar integration', 'Call reporting'],
    scope: 'Call design, system integration, launch and reporting.',
  },
  {
    slug: 'finance-back-office-operations',
    title: 'Finance Back-Office Operations',
    market: 'United Kingdom',
    industry: 'Finance & Accounting',
    pillar: 'Business Process',
    challenge: 'A finance team was spending most of each month-end on manual document processing and reconciliation.',
    solution: 'A dedicated LucidAccuracy back-office team took over processing, with documented workflows and regular reviews.',
    services: ['Back-office operations', 'Process management', 'Workforce consulting'],
    scope: 'Process mapping, transition, daily operations and reporting.',
  },
  {
    slug: 'cloud-data-platform',
    title: 'Cloud Data Platform',
    market: 'Europe',
    industry: 'Retail & E-commerce',
    pillar: 'Technology',
    challenge: 'A retailer held sales, stock and customer data in separate systems with no single reporting view.',
    solution: 'LucidAccuracy built a cloud data platform and dashboards that bring the three sources together.',
    services: ['Data & analytics', 'Cloud solutions', 'Technology consulting'],
    scope: 'Architecture, data pipelines, dashboards and handover.',
  },
  {
    slug: 'technology-upskilling-program',
    title: 'Technology Upskilling Program',
    market: 'India',
    industry: 'Technology & IT',
    pillar: 'Training',
    challenge: 'A technology team needed current cloud and data skills ahead of a platform migration.',
    solution: 'LucidAccuracy delivered an instructor-led program with hands-on labs and certification support.',
    services: ['Technology training', 'Upskilling & reskilling', 'Certification support'],
    scope: 'Skills assessment, curriculum, delivery and certification preparation.',
  },
];

export const nav = [
  { label: 'About', href: '/about/' },
  {
    label: 'Solutions',
    href: '/solutions/',
    children: solutions.map((s) => ({ label: s.nav, href: `/solutions/${s.slug}/`, text: s.lead })),
  },
  { label: 'Industries', href: '/industries/' },
  { label: 'Technology & AI', href: '/technology-ai/' },
  { label: 'Products', href: '/products/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Global Presence', href: '/global-presence/' },
  { label: 'Careers', href: '/careers/' },
];
