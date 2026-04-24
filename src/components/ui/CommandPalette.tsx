import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Hash, Clock, Bell, Calendar, FolderOpen, Video, Settings, Users, ArrowRight, Zap } from 'lucide-react'
import { useUIStore } from '@/store'
import { useChannelStore } from '@/store/channelStore'
import { MOCK_USERS } from '@/mockData'
import { cn } from '@/utils'

type ResultKind = 'channel' | 'person' | 'action' | 'recent'

interface Result {
  id: string
  kind: ResultKind
  label: string
  sublabel?: string
  icon: React.ReactNode
  action: () => void
}

export function CommandPalette() {
  const { searchOpen, closeSearch } = useUIStore()
  const { channels, teams } = useChannelStore()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) {
      setQuery('')
      setActiveIdx(0)
      setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [searchOpen])

  const results: Result[] = useCallback((): Result[] => {
    const q = query.toLowerCase().trim()

    const actions: Result[] = [
      { id: 'nav-activity', kind: 'action', label: 'Activity', icon: <Bell size={14} />, action: () => { navigate('/activity'); closeSearch() } },
      { id: 'nav-calendar', kind: 'action', label: 'Calendar', icon: <Calendar size={14} />, action: () => { navigate('/calendar'); closeSearch() } },
      { id: 'nav-files',    kind: 'action', label: 'Files',    icon: <FolderOpen size={14} />, action: () => { navigate('/files'); closeSearch() } },
      { id: 'nav-calls',    kind: 'action', label: 'Calls',    icon: <Video size={14} />, action: () => { navigate('/calls'); closeSearch() } },
      { id: 'nav-settings', kind: 'action', label: 'Settings', icon: <Settings size={14} />, action: () => { navigate('/settings'); closeSearch() } },
      { id: 'nav-teams',    kind: 'action', label: 'Teams',    icon: <Users size={14} />, action: () => { navigate('/teams'); closeSearch() } },
    ]

    if (!q) {
      const recent: Result[] = [
        { id: 'r1', kind: 'recent', label: '#general', sublabel: 'Last visited 2 min ago', icon: <Clock size={14} />, action: () => { navigate('/chat/t1/ch1'); closeSearch() } },
        { id: 'r2', kind: 'recent', label: 'Priya Sharma', sublabel: 'Direct message', icon: <Clock size={14} />, action: () => { navigate('/dm/u2'); closeSearch() } },
      ]
      return [...recent, ...actions]
    }

    const scored: Result[] = []
    channels.forEach((ch) => {
      const teamName = teams.find((t) => t.id === ch.teamId)?.name ?? ''
      if (ch.name.includes(q) || teamName.toLowerCase().includes(q)) {
        scored.push({
          id: `ch-${ch.id}`, kind: 'channel',
          label: `#${ch.name}`,
          sublabel: teamName,
          icon: <Hash size={14} />,
          action: () => { navigate(`/chat/${ch.teamId}/${ch.id}`); closeSearch() },
        })
      }
    })
    MOCK_USERS.forEach((u) => {
      if (u.name.toLowerCase().includes(q) || u.email.includes(q)) {
        scored.push({
          id: `u-${u.id}`, kind: 'person',
          label: u.name,
          sublabel: u.title,
          icon: <div className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-2xs font-semibold text-hi">{u.initials}</div>,
          action: () => { navigate(`/dm/${u.id}`); closeSearch() },
        })
      }
    })
    actions.forEach((a) => {
      if (a.label.toLowerCase().includes(q)) scored.push(a)
    })
    return scored
  }, [query, channels, teams, navigate, closeSearch])()

  useEffect(() => {
    if (!searchOpen) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)) }
      if (e.key === 'Enter')     { e.preventDefault(); results[activeIdx]?.action() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [searchOpen, results, activeIdx])

  useEffect(() => setActiveIdx(0), [query])

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]" onClick={closeSearch}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl shadow-2xl animate-fade-in"
        style={{ background: '#2b2d31', border: '1px solid rgba(255,255,255,0.12)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Search size={16} className="shrink-0 text-dim" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channels, people, actions…"
            className="flex-1 bg-transparent text-base text-hi placeholder-dim outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-dim hover:text-lo">
              Clear
            </button>
          )}
          <kbd className="rounded border border-line px-1.5 py-0.5 text-xs text-dim">Esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8">
              <Zap size={20} className="text-dim" />
              <p className="text-sm text-dim">No results for "{query}"</p>
            </div>
          )}
          {results.map((r, i) => (
            <button
              key={r.id}
              onClick={r.action}
              onMouseEnter={() => setActiveIdx(i)}
              className={cn(
                'flex w-full items-center gap-3 rounded px-3 py-2 text-left transition-colors',
                i === activeIdx ? 'bg-brand/15 text-hi' : 'text-lo hover:bg-hover',
              )}
            >
              <span className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded',
                i === activeIdx ? 'bg-brand/20 text-brand' : 'bg-surface text-dim',
              )}>
                {r.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.label}</p>
                {r.sublabel && <p className="text-xs text-dim truncate">{r.sublabel}</p>}
              </div>
              {i === activeIdx && <ArrowRight size={13} className="shrink-0 text-brand" />}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t px-4 py-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {[['↵', 'Select'], ['↑↓', 'Navigate'], ['Esc', 'Close']].map(([k, l]) => (
            <span key={k} className="flex items-center gap-1 text-xs text-dim">
              <kbd className="rounded border border-line px-1 py-0.5 font-mono text-xs">{k}</kbd>
              {l}
            </span>
          ))}
          <span className="ml-auto text-xs text-dim">{results.length} results</span>
        </div>
      </div>
    </div>
  )
}
