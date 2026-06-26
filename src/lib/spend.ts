export interface SpendEntry {
  id: string
  cardId: string
  merchant: string
  amount: number
  category: string
  date: string // ISO date string
}

const STORAGE_KEY = 'myles_spend'

export function getEntries(): SpendEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function addEntry(entry: Omit<SpendEntry, 'id'>): SpendEntry {
  const newEntry = { ...entry, id: crypto.randomUUID() }
  const entries = getEntries()
  entries.push(newEntry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  return newEntry
}

export function deleteEntry(id: string): void {
  const entries = getEntries().filter(e => e.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

// Returns total spend for a card in the current calendar month
export function getMonthSpend(cardId: string): number {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  return getEntries()
    .filter(e => {
      const d = new Date(e.date)
      return e.cardId === cardId && d.getMonth() === month && d.getFullYear() === year
    })
    .reduce((sum, e) => sum + e.amount, 0)
}
