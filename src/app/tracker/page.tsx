'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MY_CARDS } from '@/lib/cards'
import {
  getEntries,
  deleteEntry,
  getMonthSpend,
  getResetDays,
  setResetDay,
  getCycleStart,
  type SpendEntry,
} from '@/lib/spend'

export default function Tracker() {
  const [entries, setEntries] = useState<SpendEntry[]>([])
  const [monthSpend, setMonthSpend] = useState<Record<string, number>>({})
  const [resetDays, setResetDays] = useState<Record<string, number>>({})
  const [editingReset, setEditingReset] = useState<string | null>(null)
  const [resetInput, setResetInput] = useState('')

  function refresh() {
    setEntries(getEntries().slice().reverse())
    const spend: Record<string, number> = {}
    for (const card of MY_CARDS) {
      spend[card.id] = getMonthSpend(card.id)
    }
    setMonthSpend(spend)
    setResetDays(getResetDays())
  }

  useEffect(() => { refresh() }, [])

  function handleDelete(id: string) {
    deleteEntry(id)
    refresh()
  }

  function handleResetSave(cardId: string) {
    const day = parseInt(resetInput)
    if (day >= 1 && day <= 28) {
      setResetDay(cardId, day)
      refresh()
    }
    setEditingReset(null)
    setResetInput('')
  }

  function startEdit(cardId: string) {
    setEditingReset(cardId)
    setResetInput(String(resetDays[cardId] ?? 1))
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#fffcf5' }}>
      {/* Nav */}
      <div className="border-b border-stone-100 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-stone-800">Myles</span>
          <span className="text-stone-300 text-sm">Miles card optimizer</span>
        </div>
        <Link
          href="/"
          className="text-sm text-stone-400 hover:text-stone-700 transition px-3 py-1.5 rounded-lg hover:bg-stone-50"
        >
          ← Card finder
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Cap usage */}
        <h2 className="text-lg font-semibold text-stone-800 mb-1">Cap usage</h2>
        <p className="text-stone-400 text-sm mb-5">
          Spend since your statement date. Tap the reset label to change it.
        </p>

        <div className="space-y-3 mb-10">
          {MY_CARDS.map(card => {
            const spent = monthSpend[card.id] || 0
            const cap = card.monthly_cap === 999999 ? null : card.monthly_cap
            const pct = cap ? Math.min((spent / cap) * 100, 100) : 0
            const remaining = cap ? Math.max(cap - spent, 0) : null
            const full = cap !== null && spent >= cap
            const resetDay = resetDays[card.id] ?? 1
            const cycleStart = getCycleStart(card.id)
            const cycleStartStr = cycleStart.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })
            const isEditing = editingReset === card.id

            return (
              <div key={card.id} className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: card.color }} />
                    <span className="font-medium text-sm text-stone-800">{card.name}</span>
                    {full && (
                      <span className="text-xs bg-red-50 text-red-400 border border-red-100 px-2 py-0.5 rounded-full">Cap reached</span>
                    )}
                  </div>
                  <span className="text-sm text-stone-600">
                    ${spent.toFixed(0)}{cap ? ` / $${cap}` : ' (no cap)'}
                  </span>
                </div>

                {cap && (
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: full ? '#f87171' : '#0d4f6e',
                      }}
                    />
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-stone-400">
                    {full
                      ? 'Use a different card for this category'
                      : remaining !== null
                        ? `$${remaining.toFixed(0)} remaining at ${card.earn_rate} mpd`
                        : `${card.earn_rate} mpd, no cap`}
                  </p>

                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-stone-400">Day</span>
                      <input
                        type="number"
                        min={1}
                        max={28}
                        value={resetInput}
                        onChange={e => setResetInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleResetSave(card.id)
                          if (e.key === 'Escape') setEditingReset(null)
                        }}
                        autoFocus
                        className="w-14 bg-stone-50 border border-stone-300 rounded-lg px-2 py-0.5 text-xs text-stone-800 focus:outline-none focus:border-stone-500"
                      />
                      <button
                        onClick={() => handleResetSave(card.id)}
                        className="text-xs font-medium hover:opacity-70 transition"
                        style={{ color: '#0d4f6e' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingReset(null)}
                        className="text-xs text-stone-400 hover:text-stone-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(card.id)}
                      className="text-xs text-stone-300 hover:text-stone-500 transition"
                    >
                      Resets {resetDay === 1 ? 'monthly' : `on the ${resetDay}th`} · since {cycleStartStr}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Transaction log */}
        <h2 className="text-lg font-semibold text-stone-800 mb-1">Transaction log</h2>
        <p className="text-stone-400 text-sm mb-5">All logged spend this cycle.</p>

        {entries.length === 0 ? (
          <div className="bg-white border border-stone-100 rounded-2xl p-6 text-center text-stone-300 text-sm shadow-sm">
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
                  className="bg-white border border-stone-100 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm"
                >
                  <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: card?.color || '#ccc' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium capitalize text-stone-800">{entry.merchant}</div>
                    <div className="text-xs text-stone-400">{card?.name} · {dateStr}</div>
                  </div>
                  <div className="text-sm font-semibold text-stone-700">${entry.amount.toFixed(2)}</div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-stone-200 hover:text-red-400 transition text-xs ml-1"
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
