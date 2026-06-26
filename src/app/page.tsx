'use client'

import { useState } from 'react'
import {
  detectCategory,
  recommendCards,
  CATEGORY_LABELS,
  MY_CARDS,
  type Category,
} from '@/lib/cards'

export default function Home() {
  const [merchant, setMerchant] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [results, setResults] = useState(MY_CARDS)
  const [searched, setSearched] = useState(false)

  function handleSearch() {
    if (!merchant.trim()) return
    const detected = detectCategory(merchant)
    setCategory(detected)
    setResults(recommendCards(detected))
    setSearched(true)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <span className="text-2xl font-bold tracking-tight">Myles</span>
        <span className="text-gray-500 text-sm">Miles card optimizer</span>
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
                className={`rounded-2xl border p-4 flex items-center gap-4 transition ${
                  i === 0 && searched
                    ? 'border-blue-500 bg-blue-950/40'
                    : 'border-gray-800 bg-gray-900'
                }`}
              >
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
            )
          })}
        </div>
      </div>
    </main>
  )
}
