'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  detectCategory,
  recommendCards,
  CATEGORY_LABELS,
  type Category,
  type Card,
} from '@/lib/cards'
import { addEntry, getMonthSpend } from '@/lib/spend'
import { getWalletCards, getEffectiveCategories } from '@/lib/wallet'

export default function Home() {
  const [merchant, setMerchant] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [results, setResults] = useState<Card[]>([])
  const [searched, setSearched] = useState(false)
  const [logAmount, setLogAmount] = useState<Record<string, string>>({})
  const [logged, setLogged] = useState<Record<string, boolean>>({})
  const [spendMap, setSpendMap] = useState<Record<string, number>>({})

  useEffect(() => {
    const cards = getWalletCards()
    const map: Record<string, number> = {}
    for (const card of cards) map[card.id] = getMonthSpend(card.id)
    setSpendMap(map)
  }, [])

  function handleSearch() {
    if (!merchant.trim()) return
    const detected = detectCategory(merchant)
    setCategory(detected)

    const walletCards = getWalletCards()
    const map: Record<string, number> = {}
    for (const card of walletCards) map[card.id] = getMonthSpend(card.id)
    setSpendMap(map)

    // Build effective categories map for flex cards
    const effectiveCategories: Record<string, Category[]> = {}
    for (const card of walletCards) {
      effectiveCategories[card.id] = getEffectiveCategories(card)
    }

    const ranked = recommendCards(detected, walletCards, effectiveCategories)
    const top3 = ranked.filter(c => {
      const effCats = effectiveCategories[c.id] ?? c.categories
      if (!effCats.includes(detected)) return false
      if (c.monthly_cap === 999999) return true
      return map[c.id] < c.monthly_cap
    }).slice(0, 3)

    setResults(top3)
    setSearched(true)
    setLogged({})
  }

  function handleLog(cardId: string) {
    const amount = parseFloat(logAmount[cardId] || '')
    if (!amount || amount <= 0) return
    addEntry({
      cardId,
      merchant: merchant.trim(),
      amount,
      category: category || 'other',
      date: new Date().toISOString(),
    })
    setSpendMap(prev => ({ ...prev, [cardId]: (prev[cardId] || 0) + amount }))
    setLogged(prev => ({ ...prev, [cardId]: true }))
    setLogAmount(prev => ({ ...prev, [cardId]: '' }))
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#fffcf5' }}>
      <div className="max-w-2xl mx-auto px-4">
        <div className={`flex flex-col items-center transition-all ${searched ? 'pt-12' : 'pt-[22vh]'}`}>

          <p className="text-sm font-medium tracking-widest text-stone-400 uppercase mb-3">Myles</p>
          <h1 className="text-2xl font-semibold text-stone-800 mb-1 text-center">Which card should I use?</h1>
          <p className="text-sm text-stone-400 mb-7 text-center">
            Type a merchant or category and get the best card for maximum miles.
          </p>

          <div className="w-full flex gap-2">
            <input
              type="text"
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. Zara, Grab, Cold Storage..."
              className="flex-1 bg-white border border-stone-200 rounded-2xl px-5 py-3.5 text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 shadow-sm transition text-sm"
            />
            <button
              onClick={handleSearch}
              className="rounded-2xl px-6 py-3.5 font-medium text-sm text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: '#0d4f6e' }}
            >
              Find
            </button>
          </div>

          <div className="mt-4 flex gap-5">
            <Link href="/tracker" className="text-sm text-stone-400 hover:text-stone-600 transition">
              Spend tracker →
            </Link>
            <Link href="/wallet" className="text-sm text-stone-400 hover:text-stone-600 transition">
              My wallet →
            </Link>
          </div>
        </div>

        {searched && (
          <div className="mt-8 pb-16">
            {category && (
              <p className="text-xs text-stone-400 mb-4">
                Detected category:{' '}
                <span className="text-stone-600 font-medium">{CATEGORY_LABELS[category]}</span>
              </p>
            )}

            {results.length === 0 ? (
              <div className="bg-white border border-stone-100 rounded-2xl p-6 text-center text-stone-400 text-sm shadow-sm">
                No eligible cards available — all capped, or none in your wallet cover this category.{' '}
                <Link href="/wallet" className="underline hover:text-stone-600">Manage wallet →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((card, i) => {
                  const spent = spendMap[card.id] || 0
                  const cap = card.monthly_cap === 999999 ? null : card.monthly_cap
                  const pct = cap ? Math.min((spent / cap) * 100, 100) : 0
                  const remaining = cap ? Math.max(cap - spent, 0) : null
                  const isBest = i === 0
                  const amount = parseFloat(logAmount[card.id] || '')
                  const miles = amount > 0 ? Math.floor(amount * card.earn_rate) : null

                  return (
                    <div
                      key={card.id}
                      className={`rounded-2xl border p-4 bg-white transition ${
                        isBest ? 'border-stone-300 shadow-md' : 'border-stone-100 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: card.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-sm text-stone-800">{card.name}</span>
                            {isBest && (
                              <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#0d4f6e' }}>
                                Best
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400">{card.notes}</p>
                          {card.cap_note && (
                            <p className="text-xs text-amber-500 mt-0.5">{card.cap_note}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-stone-800">{card.earn_rate} mpd</div>
                          {cap && <div className="text-xs text-stone-400">Cap: ${cap}/mo</div>}
                        </div>
                      </div>

                      {cap && (
                        <div className="mb-3">
                          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: '#0d4f6e' }} />
                          </div>
                          <p className="text-xs text-stone-400 mt-1">
                            ${spent.toFixed(0)} spent · ${remaining!.toFixed(0)} remaining
                          </p>
                        </div>
                      )}

                      {/* Log spend + miles calc */}
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-stone-300">Log spend:</span>
                        <div className="flex gap-1.5 flex-1 items-center">
                          <span className="text-xs text-stone-400">$</span>
                          <input
                            type="number" min="0" step="0.01" placeholder="0.00"
                            value={logAmount[card.id] || ''}
                            onChange={e => setLogAmount(prev => ({ ...prev, [card.id]: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && handleLog(card.id)}
                            className="w-24 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400"
                          />
                          {miles !== null && (
                            <span className="text-xs font-medium" style={{ color: '#0d4f6e' }}>
                              = {miles.toLocaleString()} miles
                            </span>
                          )}
                          {logged[card.id] ? (
                            <span className="text-xs text-emerald-500 ml-1">✓ Logged</span>
                          ) : (
                            <button
                              onClick={() => handleLog(card.id)}
                              className="text-xs bg-stone-100 hover:bg-stone-200 transition rounded-lg px-3 py-1 text-stone-600 ml-auto"
                            >
                              Log
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
