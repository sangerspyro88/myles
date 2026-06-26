'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MY_CARDS } from '@/lib/cards'
import { getEntries, deleteEntry, getMonthSpend, type SpendEntry } from '@/lib/spend'

export default function Tracker() {
  const [entries, setEntries] = useState<SpendEntry[]>([])
  const [monthSpend, setMonthSpend] = useState<Record<string, number>>({})

  function refresh() {
    setEntries(getEntries().slice().reverse()) // newest first
    const spend: Record<string, number> = {}
    for (const card of MY_CARDS) {
      spend[card.id] = getMonthSpend(card.id)
    }
    setMonthSpend(spend)
  }

  useEffect(() => { refresh() }, [])

  function handleDelete(id: string) {
    deleteEntry(id)
    refresh()
  }

  const now = new Date()
  const monthLabel = now.toLocaleString('en-SG', { month: 'long', year: 'numeric' })

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tight">Myles</span>
          <span className="text-gray-500 text-sm">Miles card optimizer</span>
        </div>
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-gray-800"
        >
          ← Card finder
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Cap usage */}
        <h2 className="text-lg font-semibold mb-1">Cap usage — {monthLabel}</h2>
        <p className="text-gray-400 text-sm mb-5">How much of each card's bonus cap you've used.</p>

        <div className="space-y-3 mb-10">
          {MY_CARDS.map(card => {
            const spent = monthSpend[card.id] || 0
            const cap = card.monthly_cap === 999999 ? null : card.monthly_cap
            const pct = cap ? Math.min((spent / cap) * 100, 100) : 0
            const remaining = cap ? Math.max(cap - spent, 0) : null
            const full = cap !== null && spent >= cap

            return (
              <div key={card.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full" style={{ backgroundColor: card.color }} />
                    <span className="font-medium text-sm">{card.name}</span>
                    {full && (
                      <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded-full">Cap reached</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-300">
                    ${spent.toFixed(0)}
                    {cap ? ` / $${cap}` : ' (no cap)'}
                  </span>
                </div>

                {cap && (
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${full ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}

                {remaining !== null && (
                  <p className="text-xs text-gray-500 mt-1.5">
                    {full ? 'Use a different card for this category' : `$${remaining.toFixed(0)} remaining at ${card.earn_rate} mpd`}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Transaction log */}
        <h2 className="text-lg font-semibold mb-1">Transaction log</h2>
        <p className="text-gray-400 text-sm mb-5">All logged spend this month.</p>

        {entries.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center text-gray-500 text-sm">
            No transactions logged yet. Search a merchant and log your spend.
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map(entry => {
              const card = MY_CARDS.find(c => c.id === entry.cardId)
              const date = new Date(entry.date)
              const dateStr = date.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })
              return (
                <div
                  key={entry.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3"
                >
                  <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: card?.color || '#666' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium capitalize">{entry.merchant}</div>
                    <div className="text-xs text-gray-500">{card?.name} · {dateStr}</div>
                  </div>
                  <div className="text-sm font-semibold">${entry.amount.toFixed(2)}</div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-gray-600 hover:text-red-400 transition text-xs ml-1"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
