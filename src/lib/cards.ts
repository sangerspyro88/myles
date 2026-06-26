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
  categories: Category[]
  notes: string
}

export const MY_CARDS: Card[] = [
  {
    id: 'uob_preferred',
    name: 'UOB Preferred Platinum',
    bank: 'UOB',
    color: '#003087',
    earn_rate: 4,
    base_rate: 0.4,
    monthly_cap: 1200,
    categories: ['shopping_online', 'shopping_instore'],
    notes: '$600 cap per category (online & mobile contactless). Resets monthly.',
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
    notes: '4 mpd on all online spend. Exclusion-based MCC. Resets calendar month.',
  },
  {
    id: 'uob_ladys',
    name: "UOB Lady's",
    bank: 'UOB',
    color: '#9B59B6',
    earn_rate: 4,
    base_rate: 0.4,
    monthly_cap: 1000,
    categories: ['dining', 'shopping_instore', 'entertainment', 'travel'],
    notes: 'Choose 1 bonus category each quarter. Up to 10 mpd with Lady\'s Savings Account.',
  },
  {
    id: 'citi_rewards',
    name: 'Citi Rewards',
    bank: 'Citi',
    color: '#003B70',
    earn_rate: 4,
    base_rate: 0.4,
    monthly_cap: 1000,
    categories: ['shopping_online', 'shopping_instore', 'dining', 'transport'],
    notes: '4 mpd on shopping, food delivery, ride-hailing. Excludes travel agencies.',
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
    notes: 'Capped at 20,000 pts/year (~$417/month equivalent). Best for dining & FCY.',
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
    notes: '1.4 mpd local / 3 mpd overseas. No cap. Requires min $2,000/month spend to unlock rates.',
  },
  {
    id: 'ocbc_rewards',
    name: 'OCBC Rewards',
    bank: 'OCBC',
    color: '#D71920',
    earn_rate: 4,
    base_rate: 0.4,
    monthly_cap: 1000,
    categories: ['shopping_online', 'shopping_instore'],
    notes: '4 mpd on shopping MCCs. 6 mpd promo at Shopee/Watsons/Lazada until June 2026.',
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
    notes: '4 mpd on Dine, Shop, Travel, Play + FCY. Cap: 10,000 TREATS pts/month.',
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
  h&m: 'shopping_instore',
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
  sheng siong: 'groceries',
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
  ez-link: 'transport',

  // Travel
  singapore airlines: 'travel',
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

export function recommendCards(category: Category): Card[] {
  if (category === 'other') {
    return [...MY_CARDS].sort((a, b) => b.base_rate - a.base_rate)
  }
  const matching = MY_CARDS.filter(c => c.categories.includes(category))
  const rest = MY_CARDS.filter(c => !c.categories.includes(category))
  return [...matching, ...rest]
}
