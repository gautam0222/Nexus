import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react'
import { NavRail } from './NavRail'
import { Sidebar } from './Sidebar'
import { Tooltip } from '@/components/ui/Tooltip'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/utils'

/**
 * AppShell — root layout.
 *
 * ┌────────┬──────────┬──────────────────────────┐
 * │NavRail │ Sidebar  │       <Outlet />          │
 * │ 52px   │  236px   │         flex-1            │
 * └────────┴──────────┴──────────────────────────┘
 */
export function AppShell() {
  const {
    sidebarCollapsed, toggleSidebar,
    openSearch, closeSearch, searchOpen,
  } = useUIStore()

  // ── Global keyboard shortcuts ────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key === 'k')    { e.preventDefault(); searchOpen ? closeSearch() : openSearch() }
      if (meta && e.key === '\\')   { e.preventDefault(); toggleSidebar() }
      if (e.key === 'Escape' && searchOpen) closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen, openSearch, closeSearch, toggleSidebar])

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: '#07070E' }}
    >
      {/* Nav Rail */}
      <NavRail />

      {/* Sidebar with animated collapse */}
      <div
        className="h-full shrink-0 overflow-hidden"
        style={{
          width: sidebarCollapsed ? 0 : 'var(--sidebar-w)',
          transition: 'width 200ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Sidebar />
      </div>

      {/* Main area */}
      <main
        className="relative flex h-full flex-1 flex-col overflow-hidden"
        style={{ background: '#0C0C16' }}
      >
        {/* Sidebar toggle */}
        <div className="absolute left-3 top-3 z-20">
          <Tooltip
            content={sidebarCollapsed ? 'Show sidebar (⌘\\)' : 'Hide sidebar (⌘\\)'}
            side="bottom"
            delayDuration={400}
          >
            <button
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-100',
                'text-nx-ghost hover:bg-nx-overlay hover:text-nx-muted',
              )}
            >
              {sidebarCollapsed
                ? <PanelLeftOpen  size={15} />
                : <PanelLeftClose size={15} />
              }
            </button>
          </Tooltip>
        </div>

        {/* Page content */}
        <div className="flex h-full flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>

      {/* ── Search overlay ────────────────────────────────────────────────────── */}
      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </div>
  )
}

// ─── Search overlay ────────────────────────────────────────────────────────────
function SearchOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: 'rgba(7,7,14,0.80)', backdropFilter: 'blur(8px)' }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-[560px] overflow-hidden rounded-2xl animate-scale-in mx-4"
        style={{
          background: '#14142A',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.80)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input row */}
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}
        >
          <Search size={16} className="shrink-0 text-nx-muted" />
          <input
            autoFocus
            className="flex-1 bg-transparent text-md text-nx-primary placeholder:text-nx-ghost outline-none"
            placeholder="Search messages, channels, people…"
          />
          <kbd
            className="hidden rounded-lg px-2 py-0.5 text-[10px] font-medium text-nx-ghost sm:block"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Esc
          </kbd>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center gap-2 py-12 text-nx-muted">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl mb-1"
            style={{ background: 'rgba(139,92,246,0.08)' }}
          >
            <Search size={18} className="text-nx-violet-hi opacity-50" />
          </div>
          <p className="text-sm font-medium">Start typing to search</p>
          <p className="text-xs text-nx-ghost">Messages, channels, people, files</p>
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-4 px-4 py-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.045)' }}
        >
          {[['↵', 'Select'], ['↕', 'Navigate'], ['Esc', 'Close']].map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5 text-[10px] text-nx-ghost">
              <kbd
                className="rounded px-1.5 py-0.5 font-mono text-[10px] text-nx-muted"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {key}
              </kbd>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
