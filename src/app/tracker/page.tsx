'use client'

import { useEffect, useState } from 'react'
import { MY_CARDS } from '@/lib/cards'
import {
  getEntries,
  deleteEntry,
  getMonthSpend,
  getResetDays,
  setResetDay,
  getCycleStart,
  resetCardSpend,
  resetAllSpend,
  type SpendEntry,
} from '@/lib/spend'
import { getWalletIds } from '@/lib/wallet'

export default function Tracker() {
  const [entries, setEntries] = useState<SpendEntry[]>([])
  const [monthSpend, setMonthSpend] = useState<Record<string, number>>({})
  const [resetDays, setResetDays] = useState<Record<string, number>>({})
  const [editingReset, setEditingReset] = useState<string | null>(null)
  const [resetInput, setResetInput] = useState('')
  const [confirmReset, setConfirmReset] = useState<string | null>(null)
  const [walletIds, setWalletIds] = useState<Set<string>>(new Set())

  function refresh() {
    const ids = new Set(getWalletIds())
    setWalletIds(ids)
    setEntries(getEntries().slice().reverse())
    const spend: Record<string, number> = {}
    for (const card of MY_CARDS) spend[card.id] = getMonthSpend(card.id)
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

  function handleConfirmReset() {
    if (!confirmReset) return
    if (confirmReset === 'all') resetAllSpend()
    else resetCardSpend(confirmReset)
    setConfirmReset(null)
    refresh()
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#fffcf5' }}>
      {/* Top bar */}
      <div className="w-full px-5 pt-5 pb-2">
        <span className="text-lg font-bold tracking-tight text-stone-800">Myles</span>
      </div>

      <div className="w-full max-w-lg mx-auto px-4 py-4">
        <h2 className="text-lg font-semibold text-stone-800 mb-1">Spend Summary</h2>
        <p className="text-stone-400 text-sm mb-5">
          Spend since your statement date.
        </p>

        <div className="space-y-3 mb-10">
          {MY_CARDS.filter(c => walletIds.has(c.id)).map(card => {
            const spent = monthSpend[card.id] || 0
            const cap = card.monthly_cap === 999999 ? null : card.monthly_cap
            const pct = cap ? Math.min((spent / cap) * 100, 100) : 0
            const remaining = cap ? Math.max(cap - spent, 0) : null
            const full = cap !== null && spent >= cap
            const resetDay = resetDays[card.id] ?? 1
            const cycleStart = getCycleStart(card.id)
            const cycleStartStr = cycleStart.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })
            const isEditing = editingReset === card.id
            const isConfirming = confirmReset === card.id

            return (
              <div key={card.id} className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm">
                {/* Row 1: name + amount */}
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

                {/* Progress bar */}
                {cap && (
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: full ? '#f87171' : '#0d4f6e' }}
                    />
                  </div>
                )}

                {/* Row 2: remaining */}
                <p className="text-xs text-stone-400 mb-2">
                  {full
                    ? 'Use a different card for this category'
                    : remaining !== null
                      ? `$${remaining.toFixed(0)} remaining at ${card.earn_rate} mpd`
                      : `${card.earn_rate} mpd, no cap`}
                </p>

                {/* Row 3: statement date + reset */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-50">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-stone-400">Statement day:</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={1} max={28}
                        value={resetInput}
                        onChange={e => setResetInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleResetSave(card.id)
                          if (e.key === 'Escape') setEditingReset(null)
                        }}
                        autoFocus
                        className="w-14 bg-stone-50 border border-stone-300 rounded-lg px-2 py-0.5 text-xs text-stone-800 focus:outline-none focus:border-stone-500"
                      />
                      <button onClick={() => handleResetSave(card.id)} className="text-xs font-medium" style={{ color: '#0d4f6e' }}>Save</button>
                      <button onClick={() => setEditingReset(null)} className="text-xs text-stone-400">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingReset(card.id); setResetInput(String(resetDay)) }}
                      className="text-xs text-stone-400 active:text-stone-600 flex items-center gap-1"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      Resets {resetDay === 1 ? 'on the 1st' : `on the ${resetDay}th`} · since {cycleStartStr}
                    </button>
                  )}

                  {isConfirming ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-stone-500">Clear?</span>
                      <button onClick={handleConfirmReset} className="text-xs text-red-400 font-medium">Yes</button>
                      <button onClick={() => setConfirmReset(null)} className="text-xs text-stone-400">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmReset(card.id)} className="text-xs text-stone-300 active:text-red-400">
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Transaction log */}
        <h2 className="text-lg font-semibold text-stone-800 mb-1">Transaction Log</h2>
        <p className="text-stone-400 text-sm mb-4">All logged spend this cycle.</p>

        {entries.length === 0 ? (
          <div className="bg-white border border-stone-100 rounded-2xl p-6 text-center text-stone-300 text-sm shadow-sm">
            No transactions yet. Search a merchant and tap Log.
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map(entry => {
              const card = MY_CARDS.find(c => c.id === entry.cardId)
              const dateStr = new Date(entry.date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })
              return (
                <div key={entry.id} className="bg-white border border-stone-100 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
                  <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: card?.color || '#ccc' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium capitalize text-stone-800">{entry.merchant}</div>
                    <div className="text-xs text-stone-400">{card?.name} · {dateStr}</div>
                  </div>
                  <div className="text-sm font-semibold text-stone-700">${entry.amount.toFixed(2)}</div>
                  <button onClick={() => handleDelete(entry.id)} className="text-stone-200 active:text-red-400 text-xs ml-1">✕</button>
                </div>
              )
            })}
          </div>
        )}

        {/* Reset all */}
        <div className="mt-10 pt-6 border-t border-stone-100 flex justify-center">
          {confirmReset === 'all' ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-500">Clear all spend data?</span>
              <button onClick={handleConfirmReset} className="text-sm text-red-400 font-medium">Yes</button>
              <button onClick={() => setConfirmReset(null)} className="text-sm text-stone-400">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmReset('all')} className="text-sm text-stone-300 active:text-red-400">
              Reset all spend data
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
