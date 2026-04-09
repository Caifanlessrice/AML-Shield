let _seed = 42;

function seededRandom(): number {
  _seed = (_seed * 16807 + 0) % 2147483647;
  return (_seed - 1) / 2147483646;
}

export function resetSeed(seed = 42) {
  _seed = seed;
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return seededRandom() * (max - min) + min;
}

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(seededRandom() * arr.length)];
}

export function randomDate(start: Date, end: Date): string {
  const time = start.getTime() + seededRandom() * (end.getTime() - start.getTime());
  return new Date(time).toISOString().split('T')[0];
}

export function randomDateTime(start: Date, end: Date): string {
  const time = start.getTime() + seededRandom() * (end.getTime() - start.getTime());
  return new Date(time).toISOString();
}

export function generateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(seededRandom() * chars.length)];
  }
  return result;
}

export function weightedRandom<T>(options: { value: T; weight: number }[]): T {
  const total = options.reduce((sum, opt) => sum + opt.weight, 0);
  let r = seededRandom() * total;
  for (const opt of options) {
    r -= opt.weight;
    if (r <= 0) return opt.value;
  }
  return options[options.length - 1].value;
}

export const FIRST_NAMES = [
  'James', 'Maria', 'Chen', 'Fatima', 'Alexander', 'Sofia', 'Mohammed', 'Yuki',
  'William', 'Priya', 'Lucas', 'Amara', 'Oliver', 'Leila', 'Hans', 'Mei',
  'Carlos', 'Aisha', 'Viktor', 'Isabella', 'Dmitri', 'Nadia', 'Raj', 'Emma',
  'Sebastian', 'Zara', 'Takeshi', 'Anya', 'Marco', 'Lina'
];

export const LAST_NAMES = [
  'Anderson', 'Petrov', 'Chen', 'Al-Hassan', 'Mueller', 'Tanaka', 'Rodriguez',
  'Okafor', 'Singh', 'Johansson', 'Kim', 'Costa', 'Ivanov', 'Nakamura', 'Walsh',
  'Dubois', 'Fernandez', 'Al-Rashid', 'Novak', 'Patel', 'Morrison', 'Sato',
  'Bergström', 'Volkov', 'Reyes', 'Fitzgerald', 'Yamamoto', 'Laurent', 'Kowalski', 'Hassan'
];

export const COMPANY_NAMES = [
  'Meridian Capital Holdings', 'Pacific Rim Investments', 'Aegis Financial Group',
  'Nova Enterprises Ltd', 'Crescent Bay Trading', 'Pinnacle Asset Management',
  'Atlas Global Ventures', 'Horizon Wealth Partners', 'Sentinel Holdings Corp',
  'Vanguard Maritime Inc', 'Eclipse Capital Partners', 'Nexus Trade Finance',
  'Sterling Global Corp', 'Apex Commodity Trading', 'Titan Infrastructure Ltd',
  'Oasis Investment Trust', 'Zenith Trading Company', 'Paladin Resources Group',
  'Quantum Financial Services', 'Phoenix International Ltd'
];

export const TRUST_NAMES = [
  'Kensington Family Trust', 'Pacific Heritage Trust', 'Golden Gate Irrevocable Trust',
  'Emerald Isle Trust', 'Crown Asset Protection Trust', 'Alpine Legacy Trust',
  'Coastal Investment Trust', 'Heritage Foundation Trust', 'Summit Wealth Trust',
  'Azure Bay Trust'
];

export const JURISDICTIONS = [
  { name: 'New York, US', region: 'North America' },
  { name: 'London, UK', region: 'Europe' },
  { name: 'Cayman Islands', region: 'Caribbean' },
  { name: 'Singapore', region: 'Asia Pacific' },
  { name: 'Zurich, Switzerland', region: 'Europe' },
  { name: 'Dubai, UAE', region: 'Middle East' },
  { name: 'Hong Kong', region: 'Asia Pacific' },
  { name: 'British Virgin Islands', region: 'Caribbean' },
  { name: 'Frankfurt, Germany', region: 'Europe' },
  { name: 'Tokyo, Japan', region: 'Asia Pacific' },
  { name: 'Sydney, Australia', region: 'Asia Pacific' },
  { name: 'Toronto, Canada', region: 'North America' },
  { name: 'Luxembourg', region: 'Europe' },
  { name: 'Panama City, Panama', region: 'Latin America' },
  { name: 'Mumbai, India', region: 'Asia Pacific' },
  { name: 'São Paulo, Brazil', region: 'Latin America' },
];

export const INDUSTRIES = [
  'Banking & Finance', 'Real Estate', 'Import/Export', 'Technology',
  'Energy & Mining', 'Hospitality', 'Consulting', 'Manufacturing',
  'Retail', 'Healthcare', 'Legal Services', 'Cryptocurrency',
  'Shipping & Logistics', 'Telecommunications', 'Agriculture'
];
