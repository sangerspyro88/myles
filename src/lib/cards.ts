export type Category =
  | 'dining'
  | 'shopping_online'
  | 'shopping_instore'
  | 'groceries'
  | 'travel'
  | 'transport'
  | 'entertainment'
  | 'foreign_currency'
  | 'other'

export interface Card {
  id: string
  name: string
  bank: string
  color: string
  earn_rate: number
  base_rate: number
  monthly_cap: number
  cap_note?: string
  categories: Category[]
  flex_category?: boolean
  notes: string
}

export const MY_CARDS: Card[] = [
  {
    id: 'uob_preferred',
    name: 'UOB Preferred Visa',
    bank: 'UOB',
    color: '#003087',
    earn_rate: 4,
    base_rate: 0.4,
    monthly_cap: 600,
    cap_note: '$600 cap per category — online & contactless tracked separately',
    categories: ['shopping_online', 'shopping_instore'],
    notes: '4 mpd on online & mobile contactless. $600 cap per category, per month.',
  },
  {
    id: 'dbs_womens',
    name: "DBS Woman's World",
    bank: 'DBS',
    color: '#E2001A',
    earn_rate: 4,
    base_rate: 0.4,
    monthly_cap: 1000,
    categories: ['shopping_online'],
    notes: '4 mpd on all online spend. $1,000 cap/month.',
  },
  {
    id: 'uob_ladys',
    name: "UOB Lady's",
    bank: 'UOB',
    color: '#9B59B6',
    earn_rate: 4,
    base_rate: 0.4,
    monthly_cap: 1000,
    flex_category: true,
    categories: ['dining', 'shopping_instore', 'shopping_online', 'entertainment', 'travel', 'transport', 'foreign_currency'],
    notes: 'Choose 1 bonus category per quarter. $1,000 cap/month on chosen category.',
  },
  {
    id: 'citi_rewards',
    name: 'Citi Rewards',
    bank: 'Citi',
    color: '#003B70',
    earn_rate: 4,
    base_rate: 0.4,
    monthly_cap: 1000,
    categories: ['shopping_online', 'shopping_instore'],
    notes: '4 mpd on shopping MCCs (online & in-store). $1,000 cap/month.',
  },
  {
    id: 'sc_rewards_plus',
    name: 'SC Rewards+',
    bank: 'Standard Chartered',
    color: '#00A650',
    earn_rate: 4,
    base_rate: 0.4,
    monthly_cap: 417,
    categories: ['dining', 'foreign_currency'],
    notes: 'Capped at 20,000 pts/year (~$417/month). Verify card is still active with SC.',
  },
  {
    id: 'sc_visa_infinite',
    name: 'SC Visa Infinite',
    bank: 'Standard Chartered',
    color: '#1A1A1A',
    earn_rate: 3,
    base_rate: 1.4,
    monthly_cap: 999999,
    categories: ['foreign_currency', 'travel'],
    notes: '1.4 mpd local / 3 mpd overseas. No cap. Min $2,000/month spend to unlock full rates.',
  },
  {
    id: 'ocbc_rewards',
    name: 'OCBC Rewards',
    bank: 'OCBC',
    color: '#D71920',
    earn_rate: 6,
    base_rate: 0.4,
    monthly_cap: 1000,
    categories: ['shopping_online', 'shopping_instore'],
    notes: '6 mpd at Shopee, Lazada, Watsons, TikTok Shop, Taobao. 4 mpd other shopping MCCs. $1,000 cap/month.',
  },
  {
    id: 'maybank_xl',
    name: 'Maybank XL',
    bank: 'Maybank',
    color: '#FFCC00',
    earn_rate: 4,
    base_rate: 0.4,
    monthly_cap: 1000,
    categories: ['dining', 'shopping_instore', 'shopping_online', 'travel', 'entertainment', 'foreign_currency'],
    notes: '4 mpd on Dine, Shop, Travel, Play + FCY. $1,000 cap/month. Age 21–39 only.',
  },
]

export const CATEGORY_LABELS: Record<Category, string> = {
  dining: 'Dining',
  shopping_online: 'Online Shopping',
  shopping_instore: 'In-store Shopping',
  groceries: 'Groceries',
  travel: 'Travel',
  transport: 'Transport / Ride-hailing',
  entertainment: 'Entertainment',
  foreign_currency: 'Foreign Currency',
  other: 'Other',
}

export const MERCHANT_CATEGORY_MAP: Record<string, Category> = {
  // ── Category keywords (let users type the category itself) ──
  dining: 'dining',
  food: 'dining',
  restaurant: 'dining',
  restaurants: 'dining',
  cafe: 'dining',
  cafes: 'dining',
  'food delivery': 'dining',
  'online shopping': 'shopping_online',
  'online shop': 'shopping_online',
  'online purchase': 'shopping_online',
  'online order': 'shopping_online',
  ecommerce: 'shopping_online',
  'e-commerce': 'shopping_online',
  shopping: 'shopping_instore',
  retail: 'shopping_instore',
  'in-store': 'shopping_instore',
  'instore': 'shopping_instore',
  groceries: 'groceries',
  grocery: 'groceries',
  supermarket: 'groceries',
  'super market': 'groceries',
  travel: 'travel',
  flights: 'travel',
  flight: 'travel',
  airline: 'travel',
  airlines: 'travel',
  hotel: 'travel',
  hotels: 'travel',
  accommodation: 'travel',
  transport: 'transport',
  'ride hailing': 'transport',
  'ride-hailing': 'transport',
  taxi: 'transport',
  entertainment: 'entertainment',
  movies: 'entertainment',
  movie: 'entertainment',
  'movie tickets': 'entertainment',
  cinema: 'entertainment',
  cinemas: 'entertainment',
  streaming: 'entertainment',
  'online tickets': 'entertainment',
  tickets: 'entertainment',
  'concert tickets': 'entertainment',
  concert: 'entertainment',
  events: 'entertainment',
  event: 'entertainment',
  gaming: 'entertainment',
  games: 'entertainment',
  'foreign currency': 'foreign_currency',
  forex: 'foreign_currency',
  overseas: 'foreign_currency',
  'overseas spend': 'foreign_currency',
  fcy: 'foreign_currency',

  // ── Dining ──
  grabfood: 'dining',
  'grab food': 'dining',
  foodpanda: 'dining',
  deliveroo: 'dining',
  mcdonalds: 'dining',
  "mcdonald's": 'dining',
  starbucks: 'dining',
  kfc: 'dining',
  'burger king': 'dining',
  subway: 'dining',
  'ya kun': 'dining',
  yakun: 'dining',
  kopitiam: 'dining',
  hawker: 'dining',
  'hawker centre': 'dining',
  'toast box': 'dining',
  toastbox: 'dining',
  'old chang kee': 'dining',
  breadtalk: 'dining',
  'bengawan solo': 'dining',
  'crystal jade': 'dining',
  'din tai fung': 'dining',
  'tim ho wan': 'dining',
  'shake shack': 'dining',
  'the coffee bean': 'dining',
  'coffee bean': 'dining',
  'gloria jeans': 'dining',
  'dome cafe': 'dining',
  dome: 'dining',
  'pastamania': 'dining',
  pizza: 'dining',
  'pizza hut': 'dining',
  'dominos': 'dining',
  sushi: 'dining',
  'sushi tei': 'dining',
  sakura: 'dining',
  ichiban: 'dining',
  'nando\'s': 'dining',
  nandos: 'dining',
  poulet: 'dining',
  'maki-san': 'dining',

  // ── Online Shopping ──
  shopee: 'shopping_online',
  lazada: 'shopping_online',
  amazon: 'shopping_online',
  taobao: 'shopping_online',
  zalora: 'shopping_online',
  qoo10: 'shopping_online',
  'tiktok shop': 'shopping_online',
  'book depository': 'shopping_online',
  carousell: 'shopping_online',
  reebonz: 'shopping_online',
  farfetch: 'shopping_online',
  ssense: 'shopping_online',
  asos: 'shopping_online',
  shein: 'shopping_online',
  aliexpress: 'shopping_online',
  'apple store': 'shopping_online',
  apple: 'shopping_online',

  // ── In-store Shopping ──
  zara: 'shopping_instore',
  uniqlo: 'shopping_instore',
  'h&m': 'shopping_instore',
  'charles & keith': 'shopping_instore',
  watsons: 'shopping_instore',
  guardian: 'shopping_instore',
  ikea: 'shopping_instore',
  courts: 'shopping_instore',
  harvey: 'shopping_instore',
  'harvey norman': 'shopping_instore',
  'best denki': 'shopping_instore',
  challenger: 'shopping_instore',
  'robinsons': 'shopping_instore',
  tangs: 'shopping_instore',
  isetan: 'shopping_instore',
  marks: 'shopping_instore',
  'marks & spencer': 'shopping_instore',
  gap: 'shopping_instore',
  levi: 'shopping_instore',
  levis: 'shopping_instore',
  nike: 'shopping_instore',
  adidas: 'shopping_instore',
  puma: 'shopping_instore',
  'cotton on': 'shopping_instore',
  'pedro': 'shopping_instore',
  'aldo': 'shopping_instore',
  sephora: 'shopping_instore',
  'love bonito': 'shopping_instore',

  // ── Groceries ──
  fairprice: 'groceries',
  ntuc: 'groceries',
  'cold storage': 'groceries',
  coldstorage: 'groceries',
  giant: 'groceries',
  'sheng siong': 'groceries',
  shengsiong: 'groceries',
  redmart: 'groceries',
  'jason\'s': 'groceries',
  jasons: 'groceries',
  marketplace: 'groceries',
  'don don donki': 'groceries',
  donki: 'groceries',

  // ── Transport ──
  grab: 'transport',
  gojek: 'transport',
  tada: 'transport',
  comfort: 'transport',
  citycab: 'transport',
  simplygo: 'transport',
  mrt: 'transport',
  bus: 'transport',
  'ez-link': 'transport',
  ezlink: 'transport',
  'transit link': 'transport',
  ryde: 'transport',
  mvl: 'transport',

  // ── Travel ──
  'singapore airlines': 'travel',
  sia: 'travel',
  scoot: 'travel',
  airasia: 'travel',
  agoda: 'travel',
  booking: 'travel',
  klook: 'travel',
  expedia: 'travel',
  changi: 'travel',
  'changi airport': 'travel',
  airbnb: 'travel',
  'trip.com': 'travel',
  tripcom: 'travel',
  jetstar: 'travel',
  'malaysia airlines': 'travel',
  'cathay pacific': 'travel',
  emirates: 'travel',
  'singapore airport': 'travel',
  'duty free': 'travel',

  // ── Entertainment ──
  netflix: 'entertainment',
  spotify: 'entertainment',
  disney: 'entertainment',
  'disney+': 'entertainment',
  'golden village': 'entertainment',
  gv: 'entertainment',
  cathay: 'entertainment',
  shaw: 'entertainment',
  steam: 'entertainment',
  'apple tv': 'entertainment',
  'youtube premium': 'entertainment',
  youtube: 'entertainment',
  'hbo': 'entertainment',
  'max': 'entertainment',
  'primevideo': 'entertainment',
  'amazon prime': 'entertainment',
  'nintendo': 'entertainment',
  playstation: 'entertainment',
  xbox: 'entertainment',
  sistic: 'entertainment',
  ticketmaster: 'entertainment',
  'sport singapore': 'entertainment',

  // ── Foreign Currency ──
  usd: 'foreign_currency',
  eur: 'foreign_currency',
  gbp: 'foreign_currency',
  jpy: 'foreign_currency',
  aud: 'foreign_currency',
  krw: 'foreign_currency',
  thb: 'foreign_currency',
  hkd: 'foreign_currency',
}

export function detectCategory(merchant: string): Category {
  const lower = merchant.toLowerCase().trim()
  // Try exact match first, then substring
  if (MERCHANT_CATEGORY_MAP[lower]) return MERCHANT_CATEGORY_MAP[lower]
  for (const [keyword, category] of Object.entries(MERCHANT_CATEGORY_MAP)) {
    if (lower.includes(keyword)) return category
  }
  return 'other'
}

export function recommendCards(
  category: Category,
  walletCards: Card[],
  effectiveCategories: Record<string, Category[]> = {}
): Card[] {
  const getCategories = (c: Card) => effectiveCategories[c.id] ?? c.categories
  if (category === 'other') {
    return [...walletCards].sort((a, b) => b.base_rate - a.base_rate)
  }
  const matching = walletCards.filter(c => getCategories(c).includes(category))
  const rest = walletCards.filter(c => !getCategories(c).includes(category))
  return [...matching, ...rest]
}
