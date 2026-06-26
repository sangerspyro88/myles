'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const path = usePathname()

  const tabs = [
    {
      href: '/',
      label: 'Home',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.02 2.84L3.63 7.04C2.73 7.74 2 9.23 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29 21.19 7.74 20.2 7.05L14.02 2.72C12.62 1.74 10.37 1.79 9.02 2.84Z"
            stroke="currentColor"
            strokeWidth={active ? 2.2 : 1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={active ? 'currentColor' : 'none'}
            fillOpacity={active ? 0.15 : 0}
          />
          <path
            d="M12 17.99V14.99"
            stroke="currentColor"
            strokeWidth={active ? 2.2 : 1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      href: '/tracker',
      label: 'Summary',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12Z"
            stroke="currentColor"
            strokeWidth={active ? 2.2 : 1.6}
            fill={active ? 'currentColor' : 'none'}
            fillOpacity={active ? 0.12 : 0}
          />
          <path
            d="M8 12H12M12 12H16M12 12V8M12 12V16"
            stroke="currentColor"
            strokeWidth={active ? 2.2 : 1.6}
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      href: '/wallet',
      label: 'My Cards',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="2" y="6" width="20" height="14" rx="3"
            stroke="currentColor"
            strokeWidth={active ? 2.2 : 1.6}
            fill={active ? 'currentColor' : 'none'}
            fillOpacity={active ? 0.12 : 0}
          />
          <path
            d="M2 10H22"
            stroke="currentColor"
            strokeWidth={active ? 2.2 : 1.6}
            strokeLinecap="round"
          />
          <path
            d="M6 15H10"
            stroke="currentColor"
            strokeWidth={active ? 2.2 : 1.6}
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 z-50">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(tab => {
          const active = tab.href === '/' ? path === '/' : path.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5"
              style={{ color: active ? '#0d4f6e' : '#a8a29e' }}
            >
              {tab.icon(active)}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
      {/* iOS safe area */}
      <div className="h-safe-bottom" style={{ height: 'env(safe-area-inset-bottom)' }} />
    </nav>
  )
}
