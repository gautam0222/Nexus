import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { useUIStore } from '@/store'

export function AppShell() {
  const { openSearch, closeSearch, searchOpen } = useUIStore()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key === 'k') { e.preventDefault(); searchOpen ? closeSearch() : openSearch() }
      if (e.key === 'Escape' && searchOpen) closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen, openSearch, closeSearch])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-app">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
      <CommandPalette />
    </div>
  )
}
