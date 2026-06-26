'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  detectCategory,
  recommendCards,
  CATEGORY_LABELS,
  MY_CARDS,
  type Category,
} from '@/lib/cards'
import { addEntry } from '@/lib/spend'

export default function Home() {
  const [merchant, setMerchant] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [results, setResults] = useState(MY_CARDS)
  const [searched, setSearched] = useState(false)
  const [logAmount, setLogAmount] = useState<Record<string, string>>({})
  const [logged, setLogged] = useState<Record<string, boolean>>({})

  function handleSearch() {
    if (!merchant.trim()) return
    const detected = detectCategory(merchant)
    setCategory(detected)
    setResults(recommendCards(detected))
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
    setLogged(prev => ({ ...prev, [cardId]: true }))
    setLogAmount(prev => ({ ...prev, [cardId]: '' }))
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#fffcf5' }}>

      <div className="max-w-2xl mx-auto px-4">
        {/* Hero search block — centred when no results, top-aligned after */}
        <div className={`flex flex-col items-center transition-all ${searched ? 'pt-12' : 'pt-[22vh]'}`}>

          {/* Brand */}
          <p className="text-sm font-medium tracking-widest text-stone-400 uppercase mb-3">Myles</p>

          {/* Headline */}
          <h1 className="text-2xl font-semibold text-stone-800 mb-1 text-center">Which card should I use?</h1>
          <p className="text-sm text-stone-400 mb-7 text-center">
            Type a merchant or category and get the best card for maximum miles.
          </p>

          {/* Search bar */}
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

          {/* Spend tracker link */}
          <Link
            href="/tracker"
            className="mt-4 text-sm text-stone-400 hover:text-stone-600 transition"
          >
            Spend tracker →
          </Link>
        </div>

        {/* Results */}
        {searched && (
          <div className="mt-8 pb-16">
            {category && (
              <p className="text-xs text-stone-400 mb-4">
                Detected category:{' '}
                <span className="text-stone-600 font-medium">{CATEGORY_LABELS[category]}</span>
              </p>
            )}

            <div className="space-y-3">
              {results.map((card, i) => {
                const isMatch = category && card.categories.includes(category)
                const rate = isMatch ? card.earn_rate : card.base_rate
                const isBest = i === 0

                return (
                  <div
                    key={card.id}
                    className={`rounded-2xl border p-4 transition bg-white ${
                      isBest ? 'border-stone-300 shadow-md' : 'border-stone-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-1 self-stretch rounded-full flex-shrink-0"
                        style={{ backgroundColor: card.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-sm text-stone-800">{card.name}</span>
                          {isBest && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: '#0d4f6e' }}
                            >
                              Best
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 truncate">{card.notes}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-stone-800">{rate} mpd</div>
                        <div className="text-xs text-stone-400">
                          {isMatch
                            ? `Cap: $${card.monthly_cap === 999999 ? '∞' : card.monthly_cap}/mo`
                            : 'base rate'}
                        </div>
                      </div>
                    </div>

                    {/* Log spend */}
                    <div className="mt-3 flex gap-2 items-center">
                      <span className="text-xs text-stone-300">Log spend:</span>
                      <div className="flex gap-1.5 flex-1 items-center">
                        <span className="text-xs text-stone-400">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={logAmount[card.id] || ''}
                          onChange={e =>
                            setLogAmount(prev => ({ ...prev, [card.id]: e.target.value }))
                          }
                          onKeyDown={e => e.key === 'Enter' && handleLog(card.id)}
                          className="w-24 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400"
                        />
                        {logged[card.id] ? (
                          <span className="text-xs text-emerald-500">✓ Logged</span>
                        ) : (
                          <button
                            onClick={() => handleLog(card.id)}
                            className="text-xs bg-stone-100 hover:bg-stone-200 transition rounded-lg px-3 py-1 text-stone-600"
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
          </div>
        )}
      </div>
    </main>
  )
}
