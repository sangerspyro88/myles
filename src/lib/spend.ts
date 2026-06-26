export interface SpendEntry {
  id: string
  cardId: string
  merchant: string
  amount: number
  category: string
  date: string // ISO date string
}

const STORAGE_KEY = 'myles_spend'
const RESET_DAYS_KEY = 'myles_reset_days'

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

// Reset day per card (1–28). Defaults to 1 (calendar month).
export function getResetDays(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(RESET_DAYS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function setResetDay(cardId: string, day: number): void {
  const days = getResetDays()
  days[cardId] = day
  localStorage.setItem(RESET_DAYS_KEY, JSON.stringify(days))
}

// Returns the start of the current billing cycle for a card
export function getCycleStart(cardId: string): Date {
  const resetDay = getResetDays()[cardId] ?? 1
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()

  // If today is on or after the reset day, cycle started this month
  // Otherwise, cycle started last month
  if (today >= resetDay) {
    return new Date(year, month, resetDay)
  } else {
    // Last month — handle Jan→Dec wrap
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    return new Date(prevYear, prevMonth, resetDay)
  }
}

export function resetCardSpend(cardId: string): void {
  const cycleStart = getCycleStart(cardId)
  const entries = getEntries().filter(
    e => !(e.cardId === cardId && new Date(e.date) >= cycleStart)
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function resetAllSpend(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
}

// Returns total spend for a card in the current billing cycle
export function getMonthSpend(cardId: string): number {
  const cycleStart = getCycleStart(cardId)
  return getEntries()
    .filter(e => e.cardId === cardId && new Date(e.date) >= cycleStart)
    .reduce((sum, e) => sum + e.amount, 0)
}
