// Factory Town 2: Paradise Compass — site registry
// V2 contract: formal-domain continuing Guide Hub / post-launch Early Access

export const SITE = {
  title: 'Factory Town 2: Paradise Compass',
  description:
    'Unofficial Factory Town 2: Paradise player guide hub. Verified Early Access facts, official updates, and confirmed systems — no invented wiki content.',
  mode: 'formal-domain continuing Guide Hub',
  ads: true,
  adSlotConfig: 'sitewide_native_one_per_page',
  analytics: false,
  gameName: 'Factory Town 2: Paradise',
  platform: 'PC',
  lastChecked: '2026-07-20',
  officialUrl: 'https://store.steampowered.com/app/3312130/Factory_Town_2_Paradise/',
  siteMode: 'formal-domain continuing Guide Hub / post-launch Early Access',
  theme: 'island-workshop',
  themeColor: '#3E705C',
  backgroundColor: '#F7F2E7',
  cardColor: '#FFFDF7',
  textColor: '#20332D',
  accentColor: '#D99A38',
} as const;

// V2 enabled route registry — exactly 10 canonical routes
export const ENABLED_ROUTES = [
  {
    slug: 'home',
    canonical: '/',
    title: 'Home',
    label: 'Task Hub',
    cluster: 'entry-status',
    responsibility: 'Home, Complete Guide/Guide Hub routing, Popular Guides, Latest Updates, Sources/Trust entry',
    relatedSlugs: ['release', 'demo', 'campaign', 'checklist', 'logistics', 'power', 'recipes', 'patch-notes', 'faq'],
    evidenceState: 'confirmed',
    sourceFreshnessScope: '2026-07-20',
  },
  {
    slug: 'release',
    canonical: '/release-date-and-early-access/',
    title: 'Release Date & Early Access Status',
    label: 'Release Status',
    cluster: 'entry-status',
    responsibility: 'Current Early Access availability, launch date, platform availability',
    relatedSlugs: ['demo', 'patch-notes', 'faq', 'home'],
    evidenceState: 'confirmed',
    sourceFreshnessScope: '2026-07-20',
  },
  {
    slug: 'demo',
    canonical: '/demo-guide/',
    title: 'Demo Guide: What Is Confirmed',
    label: 'Demo Guide',
    cluster: 'entry-status',
    responsibility: 'Demo availability and confirmed boundary',
    relatedSlugs: ['release', 'campaign', 'checklist', 'home'],
    evidenceState: 'partial',
    sourceFreshnessScope: '2026-07-12',
  },
  {
    slug: 'campaign',
    canonical: '/campaign-vs-custom-maps/',
    title: 'Campaign vs Custom Maps',
    label: 'Modes',
    cluster: 'getting-started',
    responsibility: 'Mode comparison using official statements only',
    relatedSlugs: ['checklist', 'faq', 'home'],
    evidenceState: 'partial',
    sourceFreshnessScope: '2026-07-12',
  },
  {
    slug: 'checklist',
    canonical: '/getting-started-checklist/',
    title: 'First-Time Player Checklist',
    label: 'Checklist',
    cluster: 'getting-started',
    responsibility: 'Bounded Beginner responsibility — verified access and mode steps only',
    relatedSlugs: ['campaign', 'logistics', 'patch-notes', 'home'],
    evidenceState: 'partial',
    sourceFreshnessScope: '2026-07-12',
  },
  {
    slug: 'logistics',
    canonical: '/logistics-and-transport/',
    title: 'Logistics and Transport Systems',
    label: 'Logistics',
    cluster: 'systems',
    responsibility: 'Combined transport intent — confirmed system categories and Transport Decision Checklist',
    relatedSlugs: ['power', 'recipes', 'patch-notes', 'home'],
    evidenceState: 'partial',
    sourceFreshnessScope: '2026-07-12',
  },
  {
    slug: 'power',
    canonical: '/power-and-water-systems/',
    title: 'Power and Water Systems: What Is Confirmed',
    label: 'Power & Water',
    cluster: 'systems',
    responsibility: 'Confirmed energy and water system categories with evidence boundaries',
    relatedSlugs: ['logistics', 'recipes', 'patch-notes', 'home'],
    evidenceState: 'partial',
    sourceFreshnessScope: '2026-07-12',
  },
  {
    slug: 'recipes',
    canonical: '/recipe-book-and-volcano-rewards/',
    title: 'Recipe Book & Volcano Rewards',
    label: 'Progression',
    cluster: 'systems',
    responsibility: 'Recipe Book and Reward Point concept status',
    relatedSlugs: ['logistics', 'power', 'patch-notes', 'home'],
    evidenceState: 'partial',
    sourceFreshnessScope: '2026-07-12',
  },
  {
    slug: 'patch-notes',
    canonical: '/patch-notes/',
    title: 'Patch Notes and Official Updates',
    label: 'Updates',
    cluster: 'updates',
    responsibility: 'Official update timeline — each entry links to first-party Steam source',
    relatedSlugs: ['release', 'faq', 'home'],
    evidenceState: 'confirmed',
    sourceFreshnessScope: '2026-07-20',
  },
  {
    slug: 'faq',
    canonical: '/faq/',
    title: 'FAQ',
    label: 'FAQ',
    cluster: 'entry-status',
    responsibility: 'Sourced answers, corrections, disclaimer, trust routing — no thin trust URLs',
    relatedSlugs: ['release', 'demo', 'campaign', 'patch-notes', 'home'],
    evidenceState: 'confirmed',
    sourceFreshnessScope: '2026-07-20',
  },
] as const;

// Topic clusters
export const TOPIC_CLUSTERS = {
  'entry-status': ['home', 'release', 'demo', 'faq'],
  'getting-started': ['campaign', 'checklist'],
  'systems': ['logistics', 'power', 'recipes'],
  'updates': ['patch-notes'],
} as const;

// Navigation — max 6 items
export const NAV = [
  { url: '/',                             label: 'Home' },
  { url: '/release-date-and-early-access/', label: 'Release' },
  { url: '/demo-guide/',                  label: 'Demo' },
  { url: '/logistics-and-transport/',     label: 'Logistics' },
  { url: '/patch-notes/',                 label: 'Updates' },
  { url: '/faq/',                         label: 'FAQ' },
] as const;

// Helper: find route by slug
export function getRoute(slug: string) {
  return ENABLED_ROUTES.find(r => r.slug === slug);
}

// Helper: get routes in same cluster
export function getClusterRoutes(cluster: string) {
  const clusterSlugs = TOPIC_CLUSTERS[cluster as keyof typeof TOPIC_CLUSTERS];
  if (!clusterSlugs) return [];
  return ENABLED_ROUTES.filter(r => (clusterSlugs as readonly string[]).includes(r.slug));
}

// Helper: get related routes
export function getRelatedRoutes(slug: string) {
  const route = getRoute(slug);
  if (!route) return [];
  return route.relatedSlugs.map(s => getRoute(s)).filter((r): r is typeof ENABLED_ROUTES[number] => r !== undefined);
}
