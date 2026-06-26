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
  earn_rate: number // mpd on bonus categories
  base_rate: number // mpd on everything else
  monthly_cap: number // SGD spending cap for bonus rate
  cap_note?: string  // extra detail about how the cap works
  categories: Category[]
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
    cap_note: '$600 cap applies per category (online & contactless are tracked separately)',
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
    notes: '4 mpd on all online spend. $1,000 cap/month. Exclusion-based MCC.',
  },
  {
    id: 'uob_ladys',
    name: "UOB Lady's",
    bank: 'UOB',
    color: '#9B59B6',
    earn_rate: 4,
    base_rate: 0.4,
    monthly_cap: 1000,
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
    notes: '4 mpd on shopping MCCs (online & in-store). $1,000 cap/month. Excludes travel agencies.',
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
    notes: 'Capped at 20,000 pts/year (~$417/month). Note: card may be discontinued — verify with SC.',
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
    notes: '6 mpd promo at Shopee, Lazada, Watsons, TikTok Shop, Taobao. 4 mpd on other shopping MCCs. $1,000 cap/month.',
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
    notes: '4 mpd on Dine, Shop, Travel, Play + FCY. $1,000 cap/month (10,000 TREATS pts). Age 21–39 only.',
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
  // Dining
  'grab food': 'dining',
  grabfood: 'dining',
  foodpanda: 'dining',
  mcdonalds: 'dining',
  "mcdonald's": 'dining',
  starbucks: 'dining',
  'ya kun': 'dining',
  kopitiam: 'dining',
  hawker: 'dining',
  restaurant: 'dining',
  cafe: 'dining',
  kfc: 'dining',
  'burger king': 'dining',
  subway: 'dining',
  deliveroo: 'dining',

  // Online Shopping
  shopee: 'shopping_online',
  lazada: 'shopping_online',
  amazon: 'shopping_online',
  taobao: 'shopping_online',
  zalora: 'shopping_online',
  'book depository': 'shopping_online',
  qoo10: 'shopping_online',
  'tiktok shop': 'shopping_online',

  // In-store Shopping
  zara: 'shopping_instore',
  uniqlo: 'shopping_instore',
  'h&m': 'shopping_instore',
  'charles & keith': 'shopping_instore',
  watsons: 'shopping_instore',
  guardian: 'shopping_instore',
  ikea: 'shopping_instore',
  courts: 'shopping_instore',
  harvey: 'shopping_instore',

  // Groceries
  fairprice: 'groceries',
  ntuc: 'groceries',
  'cold storage': 'groceries',
  giant: 'groceries',
  'sheng siong': 'groceries',
  redmart: 'groceries',

  // Transport
  grab: 'transport',
  gojek: 'transport',
  tada: 'transport',
  comfort: 'transport',
  citycab: 'transport',
  simplygo: 'transport',
  mrt: 'transport',
  bus: 'transport',
  'ez-link': 'transport',

  // Travel
  'singapore airlines': 'travel',
  sia: 'travel',
  scoot: 'travel',
  airasia: 'travel',
  agoda: 'travel',
  booking: 'travel',
  klook: 'travel',
  expedia: 'travel',
  changi: 'travel',
  hotel: 'travel',

  // Entertainment
  netflix: 'entertainment',
  spotify: 'entertainment',
  disney: 'entertainment',
  'golden village': 'entertainment',
  gv: 'entertainment',
  cathay: 'entertainment',
  shaw: 'entertainment',
  steam: 'entertainment',

  // Foreign Currency
  overseas: 'foreign_currency',
  'foreign currency': 'foreign_currency',
  usd: 'foreign_currency',
  eur: 'foreign_currency',
  gbp: 'foreign_currency',
}

export function detectCategory(merchant: string): Category {
  const lower = merchant.toLowerCase().trim()
  for (const [keyword, category] of Object.entries(MERCHANT_CATEGORY_MAP)) {
    if (lower.includes(keyword)) return category
  }
  return 'other'
}

export function recommendCards(category: Category, walletCards: Card[]): Card[] {
  if (category === 'other') {
    return [...walletCards].sort((a, b) => b.base_rate - a.base_rate)
  }
  const matching = walletCards.filter(c => c.categories.includes(category))
  const rest = walletCards.filter(c => !c.categories.includes(category))
  return [...matching, ...rest]
}
