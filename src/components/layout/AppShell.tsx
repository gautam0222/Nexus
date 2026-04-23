import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavRail } from './NavRail'
import { Sidebar } from './Sidebar'
import { Tooltip } from '@/components/ui/Tooltip'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/utils'

/**
 * AppShell — Standard layout.
 *
 * ┌──────┬──────────┬──────────────────────┐
 * │ Rail │ Sidebar  │    <Outlet />        │
 * │ 56px │  240px   │      flex-1          │
 * └──────┴──────────┴──────────────────────┘
 */
export function AppShell() {
  const {
    sidebarCollapsed, toggleSidebar,
    openSearch, closeSearch, searchOpen,
  } = useUIStore()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key === 'k')  { e.preventDefault(); searchOpen ? closeSearch() : openSearch() }
      if (meta && e.key === '\\') { e.preventDefault(); toggleSidebar() }
      if (e.key === 'Escape' && searchOpen) closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen, openSearch, closeSearch, toggleSidebar])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-nx-base">
      {/* Nav rail */}
      <NavRail />

      {/* Collapsible sidebar */}
      <div
        className="h-full shrink-0 overflow-hidden"
        style={{
          width: sidebarCollapsed ? 0 : 'var(--sidebar-w)',
          transition: 'width 180ms ease',
        }}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="relative flex h-full flex-1 flex-col overflow-hidden">
        {/* Sidebar toggle — top-left of main */}
        <div className="absolute left-3 top-3 z-20">
          <Tooltip content={sidebarCollapsed ? 'Show sidebar  ⌘\\' : 'Hide sidebar  ⌘\\'} side="right">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-md transition-all duration-100',
                'text-nx-muted hover:bg-nx-hover hover:text-nx-secondary',
              )}
            >
              {sidebarCollapsed
                ? <PanelLeftOpen  size={14} />
                : <PanelLeftClose size={14} />}
            </button>
          </Tooltip>
        </div>

        {/* Page */}
        <div className="flex h-full flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>

      {/* Search overlay */}
      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </div>
  )
}

// ─── Search overlay ────────────────────────────────────────────
function SearchOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-[520px] mx-4 overflow-hidden rounded-2xl animate-scale-in"
        style={{
          background: '#1A1A1D',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.09), 0 24px 64px rgba(0,0,0,0.75)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 sep-b">
          <svg className="shrink-0 text-nx-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            autoFocus
            placeholder="Search messages, channels, people…"
            className="flex-1 bg-transparent text-base text-nx-primary placeholder:text-nx-muted"
          />
          <kbd className="hidden rounded-md px-2 py-0.5 text-[11px] text-nx-muted sm:block"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Esc
          </kbd>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center gap-2 py-12 text-nx-muted">
          <p className="text-sm">Start typing to search</p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 sep" style={{ background: 'rgba(0,0,0,0.15)' }}>
          {[['↵','Open'], ['↑↓','Navigate'], ['Esc','Close']].map(([k,l]) => (
            <span key={k} className="flex items-center gap-1.5 text-[11px] text-nx-ghost">
              <kbd className="rounded px-1.5 py-0.5 text-[10px] text-nx-muted"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {k}
              </kbd>
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
