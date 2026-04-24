import { useState } from 'react'
import { X, Search } from 'lucide-react'
import { useUIStore } from '@/store'
import { MOCK_USERS } from '@/mockData'
import { cn } from '@/utils'
import type { UserStatus } from '@/types'

export function MemberListPanel() {
  const { rightPanelOpen, toggleRightPanel } = useUIStore()
  const [search, setSearch] = useState('')

  const filtered = MOCK_USERS.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  const online  = filtered.filter((u) => u.status === 'online')
  const others  = filtered.filter((u) => u.status !== 'online')

  const statusDot = (s: UserStatus) => cn(
    'h-2 w-2 rounded-full shrink-0',
    s === 'online' ? 'bg-online' : s === 'busy' ? 'bg-busy' : s === 'away' ? 'bg-away' : 'bg-offline',
  )

  return (
    <div
      className={cn(
        'flex h-full shrink-0 flex-col border-l overflow-hidden transition-all duration-200',
        rightPanelOpen ? 'w-60' : 'w-0',
      )}
      style={{ background: '#1e2124', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center justify-between border-b px-4 py-3 shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <h2 className="text-sm font-semibold text-hi">Members</h2>
        <button onClick={toggleRightPanel} className="text-dim hover:text-lo transition-colors">
          <X size={15} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 shrink-0">
        <div className="flex items-center gap-2 rounded bg-surface px-2.5 py-1.5">
          <Search size={13} className="text-dim shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find member…"
            className="flex-1 bg-transparent text-sm text-hi placeholder-dim outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {online.length > 0 && (
          <div className="mb-3">
            <p className="px-2 pb-1 text-2xs font-semibold uppercase tracking-wider text-dim">
              Online — {online.length}
            </p>
            {online.map((u) => (
              <button key={u.id} className="ch-item">
                <div className="relative shrink-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs font-semibold text-hi">
                    {u.initials}
                  </div>
                  <span className={cn('absolute -bottom-px -right-px ring-1 ring-sidebar', statusDot(u.status))} />
                </div>
                <span className="flex-1 truncate text-sm">{u.name}</span>
              </button>
            ))}
          </div>
        )}
        {others.length > 0 && (
          <div>
            <p className="px-2 pb-1 text-2xs font-semibold uppercase tracking-wider text-dim">
              Offline — {others.length}
            </p>
            {others.map((u) => (
              <button key={u.id} className="ch-item opacity-50">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold text-hi">
                  {u.initials}
                </div>
                <span className="flex-1 truncate text-sm">{u.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
