import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavRail } from './NavRail'
import { Sidebar } from './Sidebar'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/utils'

/**
 * AppShell — INVERTED LAYOUT.
 *
 * ┌────────────────┬─────────────────────────┬───────┐
 * │  Sidebar LEFT  │  Main Content (flex-1)  │ Nav R │
 * │   channels     │  grid-bg + messages     │ Rail  │
 * └────────────────┴─────────────────────────┴───────┘
 *
 * Nav rail is on the RIGHT — opposite of every collab app ever.
 * Sidebar on far left — channels first, nav last.
 * Scanlines CSS overlay spans the whole viewport.
 * Search opens as a cyberpunk fullscreen overlay.
 */
export function AppShell() {
  const {
    sidebarCollapsed, toggleSidebar,
    openSearch, closeSearch, searchOpen,
  } = useUIStore()

  // Global keyboard shortcuts
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
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: '#01010A' }}
    >
      {/* ── CRT Scanlines (spans entire viewport) ── */}
      <div className="scanlines" aria-hidden />

      {/* ── LEFT: Sidebar ── */}
      <div
        className="h-full shrink-0 overflow-hidden"
        style={{
          width: sidebarCollapsed ? 0 : 'var(--sidebar-w)',
          transition: 'width 200ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Sidebar onToggle={toggleSidebar} collapsed={sidebarCollapsed} />
      </div>

      {/* ── CENTER: Main area ── */}
      <main className="relative flex h-full flex-1 flex-col overflow-hidden grid-bg">
        {/* Sidebar toggle — top left of main, above the HUD */}
        <div className="pointer-events-none absolute left-0 top-0 z-40 p-2">
          <button
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            className={cn(
              'pointer-events-auto flex h-7 w-7 items-center justify-center rounded-lg',
              'transition-all duration-150 text-nx-dim hover:text-nx-fog',
              'hover:bg-white/5',
            )}
          >
            {sidebarCollapsed
              ? <PanelLeftOpen  size={14} />
              : <PanelLeftClose size={14} />
            }
          </button>
        </div>

        {/* Page content (Chat, Calendar, etc.) */}
        <div className="relative z-10 flex h-full flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>

      {/* ── RIGHT: Nav Rail ── */}
      <NavRail />

      {/* ── Search overlay ── */}
      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </div>
  )
}

/* ─── Cyberpunk search overlay ────────────────────────────────── */
function SearchOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: 'rgba(1,1,10,0.92)', backdropFilter: 'blur(8px)' }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-[540px] animate-scale-in mx-4 overflow-hidden rounded-2xl"
        style={{
          background: '#0D0D25',
          boxShadow: '0 0 0 1px rgba(0,238,255,0.15), 0 32px 80px rgba(0,0,0,0.95)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div
          className="h-[1px] w-full"
          style={{ background: 'linear-gradient(90deg, transparent, #00EEFF, #9D00FF, #FF0055, transparent)' }}
        />

        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 sep-bottom">
          <span className="font-mono text-sm neon-cyan shrink-0">~/search</span>
          <span className="font-mono text-nx-dim shrink-0">$</span>
          <input
            autoFocus
            className="flex-1 bg-transparent font-mono text-sm text-white placeholder:text-nx-dim outline-none"
            placeholder="query messages channels people files..."
          />
          <kbd
            className="hidden rounded px-2 py-0.5 font-mono text-[9px] text-nx-dim sm:block"
            style={{ background: 'rgba(0,238,255,0.05)', border: '1px solid rgba(0,238,255,0.10)' }}
          >
            ESC
          </kbd>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center gap-3 py-12">
          <div
            className="font-mono text-[10px] tracking-widest"
            style={{ color: 'rgba(0,238,255,0.25)' }}
          >
            ─── AWAITING INPUT ───
          </div>
          <p className="font-mono text-xs text-nx-dim">Start typing to search across Nexus</p>
        </div>

        {/* Footer keybinds */}
        <div
          className="flex items-center gap-4 px-4 py-2.5 sep-top"
          style={{ background: 'rgba(0,0,0,0.25)' }}
        >
          {[['↵','Select'], ['↕','Navigate'], ['Esc','Close']].map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5">
              <kbd
                className="rounded px-1.5 py-0.5 font-mono text-[9px] neon-cyan"
                style={{ background: 'rgba(0,238,255,0.05)', border: '1px solid rgba(0,238,255,0.15)' }}
              >{key}</kbd>
              <span className="text-[10px] text-nx-dim font-mono">{label}</span>
            </span>
          ))}
          <span className="ml-auto font-mono text-[9px] text-nx-ghost">NEXUS // HYPERCORE</span>
        </div>
      </div>
    </div>
  )
}
