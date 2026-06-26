import { MY_CARDS, type Card } from './cards'

const WALLET_KEY = 'myles_wallet'

// Returns the set of card IDs the user has in their wallet.
// Defaults to all cards if never set.
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
