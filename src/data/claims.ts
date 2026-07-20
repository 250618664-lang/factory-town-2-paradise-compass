// Factory Town 2: Paradise Compass — runtime claims registry
// V2: post-launch Early Access. Maps claim IDs to verified official facts.
// Does NOT contain private research notes, screenshots, or raw evidence logs.

export interface Claim {
  id: string;
  fact: string;
  sourceUrl: string;
  observedDate: string;
  status: 'confirmed' | 'partial' | 'hold';
}

export const CLAIMS: Claim[] = [
  {
    id: 'ft2-release-live-20260720',
    fact: 'Steam Early Access launched July 14, 2026.',
    sourceUrl: 'https://store.steampowered.com/app/3312130/Factory_Town_2_Paradise/',
    observedDate: '2026-07-20',
    status: 'confirmed',
  },
  {
    id: 'ft2-demo-live-20260720',
    fact: 'A Steam demo is available.',
    sourceUrl: 'https://store.steampowered.com/app/3312130/Factory_Town_2_Paradise/',
    observedDate: '2026-07-20',
    status: 'confirmed',
  },
  {
    id: 'ft2-progress-001',
    fact: 'Official description confirms a guided campaign/tutorial plus custom maps with randomized terrain and resources.',
    sourceUrl: 'https://store.steampowered.com/app/3312130/Factory_Town_2_Paradise/',
    observedDate: '2026-07-12',
    status: 'confirmed',
  },
  {
    id: 'ft2-logistics-001',
    fact: 'Official description confirms roads, bridges, trains, belts, boats, catapults and zip lines as transport-system categories.',
    sourceUrl: 'https://store.steampowered.com/app/3312130/Factory_Town_2_Paradise/',
    observedDate: '2026-07-12',
    status: 'confirmed',
  },
  {
    id: 'ft2-power-water-001',
    fact: 'Official description confirms water, waterwheels, windmills, drive shafts, generators and power lines as power/water system categories.',
    sourceUrl: 'https://store.steampowered.com/app/3312130/Factory_Town_2_Paradise/',
    observedDate: '2026-07-12',
    status: 'confirmed',
  },
  {
    id: 'ft2-recipe-book-001',
    fact: 'Official post describes the Recipe Book / Reward Point concept for progression.',
    sourceUrl: 'https://steamcommunity.com/app/3312130/?curator_clanid=4777282',
    observedDate: '2026-07-12',
    status: 'confirmed',
  },
  {
    id: 'ft2-patch-129-20260720',
    fact: 'Official Patch Notes 129 were posted July 18, 2026 and cover usability, resource-generation, river-generation, and bug-fix changes.',
    sourceUrl: 'https://steamcommunity.com/app/3312130/?curator_clanid=4777282',
    observedDate: '2026-07-20',
    status: 'confirmed',
  },
  {
    id: 'ft2-patch-128-20260720',
    fact: 'Official Patch Notes 128 were posted July 17, 2026 and cover worker-supply filters, screen-scale recovery, balance changes, and bug fixes.',
    sourceUrl: 'https://steamcommunity.com/app/3312130/?curator_clanid=4777282',
    observedDate: '2026-07-20',
    status: 'confirmed',
  },
  {
    id: 'ft2-patch-127-20260720',
    fact: 'Official Patch Notes 127 were posted July 14, 2026 and cover view-mode messaging, transfer behavior, interface changes, and bug fixes.',
    sourceUrl: 'https://steamcommunity.com/app/3312130/?curator_clanid=4777282',
    observedDate: '2026-07-20',
    status: 'confirmed',
  },
];

// Helper to look up a claim by ID at runtime
export function getClaim(id: string): Claim | undefined {
  return CLAIMS.find(c => c.id === id);
}

// Return all confirmed claims for validator use
export function getConfirmedClaims(): Claim[] {
  return CLAIMS.filter(c => c.status === 'confirmed');
}
