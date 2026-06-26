'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MY_CARDS } from '@/lib/cards'
import { getWalletIds, setWalletIds } from '@/lib/wallet'

export default function Wallet() {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    setSelected(new Set(getWalletIds()))
  }, [])

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      setWalletIds(Array.from(next))
      return next
    })
  }

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
          Select the cards you own. Only your wallet cards appear in recommendations and the spend tracker.
        </p>

        <div className="space-y-3">
          {MY_CARDS.map(card => {
            const active = selected.has(card.id)
            return (
              <button
                key={card.id}
                onClick={() => toggle(card.id)}
                className={`w-full text-left rounded-2xl border p-4 transition flex items-center gap-4 ${
                  active
                    ? 'bg-white border-stone-300 shadow-md'
                    : 'bg-stone-50 border-stone-100 opacity-50'
                }`}
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
