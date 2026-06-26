'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MY_CARDS, CATEGORY_LABELS, type Category } from '@/lib/cards'
import { getWalletIds, setWalletIds, getChosenCategories, setChosenCategory } from '@/lib/wallet'

export default function Wallet() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [chosenCategories, setChosenCategories] = useState<Record<string, Category>>({})

  useEffect(() => {
    setSelected(new Set(getWalletIds()))
    setChosenCategories(getChosenCategories())
  }, [])

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      setWalletIds(Array.from(next))
      return next
    })
  }

  function handleCategoryChange(cardId: string, category: Category) {
    setChosenCategory(cardId, category)
    setChosenCategories(prev => ({ ...prev, [cardId]: category }))
  }

  // Categories available for flex cards — exclude 'other' and 'groceries' (not eligible)
  const FLEX_CATEGORIES: Category[] = [
    'dining', 'shopping_online', 'shopping_instore',
    'travel', 'transport', 'entertainment', 'foreign_currency',
  ]

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#fffcf5' }}>
      <div className="border-b border-stone-100 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-stone-800">Myles</span>
          <span className="text-stone-300 text-sm">Miles card optimizer</span>
        </div>
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-700 transition px-3 py-1.5 rounded-lg hover:bg-stone-50">
          ← Card finder
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-lg font-semibold text-stone-800 mb-1">My Wallet</h2>
        <p className="text-stone-400 text-sm mb-6">
          Select the cards you own. For cards with a chosen category, set your active selection.
        </p>

        <div className="space-y-3">
          {MY_CARDS.map(card => {
            const active = selected.has(card.id)
            const chosenCat = chosenCategories[card.id]

            return (
              <div
                key={card.id}
                className={`rounded-2xl border bg-white transition ${
                  active ? 'border-stone-300 shadow-md' : 'border-stone-100 opacity-50'
                }`}
              >
                {/* Card row */}
                <button
                  onClick={() => toggle(card.id)}
                  className="w-full text-left p-4 flex items-center gap-4"
                >
                  <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: card.color }} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-stone-800">{card.name}</span>
                      <span className="text-xs text-stone-400">{card.bank}</span>
                    </div>
                    <p className="text-xs text-stone-400">{card.notes}</p>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-3">
                    <span className="text-sm font-bold text-stone-700">{card.earn_rate} mpd</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                        active ? 'border-transparent' : 'border-stone-300 bg-white'
                      }`}
                      style={active ? { backgroundColor: '#0d4f6e' } : {}}
                    >
                      {active && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>

                {/* Category picker for flex cards */}
                {card.flex_category && active && (
                  <div className="px-4 pb-4 pt-0 border-t border-stone-100">
                    <p className="text-xs text-stone-400 mb-2 mt-3">
                      Active bonus category this quarter:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {FLEX_CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => handleCategoryChange(card.id, cat)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition ${
                            chosenCat === cat
                              ? 'text-white border-transparent'
                              : 'text-stone-500 border-stone-200 bg-stone-50 hover:border-stone-300'
                          }`}
                          style={chosenCat === cat ? { backgroundColor: '#0d4f6e', borderColor: '#0d4f6e' } : {}}
                        >
                          {CATEGORY_LABELS[cat]}
                        </button>
                      ))}
                    </div>
                    {!chosenCat && (
                      <p className="text-xs text-amber-500 mt-2">Select your active category so this card appears in the right recommendations.</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-stone-300 mt-8">
          {selected.size} of {MY_CARDS.length} cards selected
        </p>
      </div>
    </main>
  )
}
