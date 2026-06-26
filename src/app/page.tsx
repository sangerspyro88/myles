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
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tight">Myles</span>
          <span className="text-gray-500 text-sm">Miles card optimizer</span>
        </div>
        <Link
          href="/tracker"
          className="text-sm text-gray-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-gray-800"
        >
          Spend tracker →
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Search */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold mb-1">Which card should I use?</h1>
          <p className="text-gray-400 text-sm mb-4">
            Type a merchant or category and get the best card for maximum miles.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. Zara, Grab, Cold Storage..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-500 transition rounded-xl px-5 py-3 font-medium"
            >
              Find
            </button>
          </div>

          {searched && category && (
            <p className="mt-3 text-sm text-gray-400">
              Detected category:{' '}
              <span className="text-white font-medium">{CATEGORY_LABELS[category]}</span>
            </p>
          )}
        </div>

        {/* Results */}
        <div className="space-y-3">
          {results.map((card, i) => {
            const isMatch = category && card.categories.includes(category)
            const rate = isMatch ? card.earn_rate : card.base_rate
            return (
              <div
                key={card.id}
                className={`rounded-2xl border p-4 transition ${
                  i === 0 && searched
                    ? 'border-blue-500 bg-blue-950/40'
                    : 'border-gray-800 bg-gray-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Colour stripe */}
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ backgroundColor: card.color }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm">{card.name}</span>
                      {i === 0 && searched && (
                        <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">Best</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{card.notes}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold">{rate} mpd</div>
                    <div className="text-xs text-gray-400">
                      {isMatch
                        ? `Cap: $${card.monthly_cap === 999999 ? '∞' : card.monthly_cap}/mo`
                        : 'base rate'}
                    </div>
                  </div>
                </div>

                {/* Log spend row — only show after a search */}
                {searched && (
                  <div className="mt-3 flex gap-2 items-center">
                    <span className="text-xs text-gray-500">Log spend:</span>
                    <div className="flex gap-1.5 flex-1">
                      <span className="text-xs text-gray-400 self-center">$</span>
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
                        className="w-24 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                      {logged[card.id] ? (
                        <span className="text-xs text-green-400 self-center">✓ Logged</span>
                      ) : (
                        <button
                          onClick={() => handleLog(card.id)}
                          className="text-xs bg-gray-700 hover:bg-gray-600 transition rounded-lg px-3 py-1"
                        >
                          Log
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
