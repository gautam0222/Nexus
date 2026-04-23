import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavRail } from './NavRail'
import { Sidebar } from './Sidebar'
import { Tooltip } from '@/components/ui/Tooltip'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/utils'

/**
 * AppShell — the root layout for the entire app.
 *
 * Structure:
 * ┌──────────┬──────────┬──────────────────────────┐
 * │ NavRail  │ Sidebar  │   <Outlet /> (content)   │
 * │  64px    │  260px   │        flex-1            │
 * └──────────┴──────────┴──────────────────────────┘
 *
 * The sidebar collapses to 0 when sidebarCollapsed=true.
 * A future right panel will slot in after <Outlet />.
 */
export function AppShell() {
  const { sidebarCollapsed, toggleSidebar, openSearch, closeSearch, searchOpen } = useUIStore()

  // ─── Global keyboard shortcuts ──────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey

      // ⌘K — open search
      if (meta && e.key === 'k') {
        e.preventDefault()
        searchOpen ? closeSearch() : openSearch()
      }

      // ⌘\ — toggle sidebar
      if (meta && e.key === '\\') {
        e.preventDefault()
        toggleSidebar()
      }

      // Esc — close overlays
      if (e.key === 'Escape' && searchOpen) {
        closeSearch()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen, openSearch, closeSearch, toggleSidebar])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-nx-bg">

      {/* ── Nav Rail ─────────────────────────────────────────── */}
      <NavRail />

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <div
        className={cn(
          'h-full flex-shrink-0 transition-[width] duration-200 ease-smooth overflow-hidden',
          sidebarCollapsed ? 'w-0' : 'w-sidebar'
        )}
      >
        <Sidebar />
      </div>

      {/* ── Main content area ────────────────────────────────── */}
      <main className="relative flex h-full flex-1 flex-col overflow-hidden bg-nx-surface">

        {/* Sidebar toggle button — sits at the top-left of main */}
        <div className="absolute left-3 top-3 z-10">
          <Tooltip
            content={sidebarCollapsed ? 'Show sidebar (⌘\\)' : 'Hide sidebar (⌘\\)'}
            side="bottom"
          >
            <button
              onClick={toggleSidebar}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-md',
                'text-nx-subtle transition-all hover:bg-nx-surface2 hover:text-nx-muted'
              )}
              aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            >
              {sidebarCollapsed
                ? <PanelLeftOpen size={16} />
                : <PanelLeftClose size={16} />
              }
            </button>
          </Tooltip>
        </div>

        {/* Page content rendered by the router */}
        <div className="flex h-full flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>

      {/* ── Search overlay (placeholder — will be a full modal in Phase 3) ── */}
      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </div>
  )
}

// ─── Minimal search overlay placeholder ──────────────────────────────────────
// Full Cmd+K palette will be built in Phase 3. This keeps the shortcut functional.

function SearchOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Search panel */}
      <div
        className={cn(
          'relative w-full max-w-xl rounded-2xl border border-nx-border bg-nx-surface shadow-glow-md',
          'animate-scale-in overflow-hidden'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-nx-border px-4 py-3.5">
          <svg className="h-4 w-4 flex-shrink-0 text-nx-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            className="flex-1 bg-transparent text-md text-nx-cream placeholder-nx-subtle outline-none"
            placeholder="Search messages, channels, people…"
          />
          <kbd className="rounded border border-nx-border px-1.5 py-0.5 text-xs text-nx-subtle">Esc</kbd>
        </div>

        {/* Placeholder empty state */}
        <div className="flex flex-col items-center gap-2 py-10 text-nx-muted">
          <svg className="h-8 w-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <p className="text-sm">Start typing to search Nexus</p>
          <p className="text-xs text-nx-subtle">Messages, channels, people, files</p>
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 border-t border-nx-border px-4 py-2">
          {[['↵', 'Select'], ['↑↓', 'Navigate'], ['Esc', 'Close']].map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-nx-subtle">
              <kbd className="rounded border border-nx-border px-1.5 py-0.5 font-mono text-xs">{key}</kbd>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
