import { MY_CARDS, type Card, type Category } from './cards'

const WALLET_KEY = 'myles_wallet'
const CHOSEN_CATEGORIES_KEY = 'myles_chosen_categories'

export function getWalletIds(): string[] {
  if (typeof window === 'undefined') return MY_CARDS.map(c => c.id)
  try {
    const stored = localStorage.getItem(WALLET_KEY)
    if (!stored) return MY_CARDS.map(c => c.id)
    return JSON.parse(stored)
  } catch {
    return MY_CARDS.map(c => c.id)
  }
}

export function setWalletIds(ids: string[]): void {
  localStorage.setItem(WALLET_KEY, JSON.stringify(ids))
}

export function getWalletCards(): Card[] {
  const ids = new Set(getWalletIds())
  return MY_CARDS.filter(c => ids.has(c.id))
}

// For flex_category cards: stores the user's currently chosen category
export function getChosenCategories(): Record<string, Category> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(CHOSEN_CATEGORIES_KEY) || '{}')
  } catch {
    return {}
  }
}

export function setChosenCategory(cardId: string, category: Category): void {
  const current = getChosenCategories()
  current[cardId] = category
  localStorage.setItem(CHOSEN_CATEGORIES_KEY, JSON.stringify(current))
}

// Returns the effective categories for a card, respecting user choice for flex cards
export function getEffectiveCategories(card: Card): Category[] {
  if (!card.flex_category) return card.categories
  const chosen = getChosenCategories()[card.id]
  return chosen ? [chosen] : []
}
