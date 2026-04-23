import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/constants'
import type { NavSection } from '@/types'

interface UIState {
  activeSection: NavSection
  setActiveSection: (section: NavSection) => void

  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  rightPanelOpen: boolean
  toggleRightPanel: () => void

  threadPanelOpen: boolean
  activeThreadId: string | null
  openThread: (messageId: string) => void
  closeThread: () => void

  searchOpen: boolean
  openSearch: () => void
  closeSearch: () => void

  theme: 'dark' | 'light'
  toggleTheme: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      activeSection: 'chat',
      setActiveSection: (section) => set({ activeSection: section }),

      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      rightPanelOpen: false,
      toggleRightPanel: () =>
        set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),

      threadPanelOpen: false,
      activeThreadId: null,
      openThread: (messageId) =>
        set({ threadPanelOpen: true, activeThreadId: messageId }),
      closeThread: () => set({ threadPanelOpen: false, activeThreadId: null }),

      searchOpen: false,
      openSearch: () => set({ searchOpen: true }),
      closeSearch: () => set({ searchOpen: false }),

      theme: 'dark',
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'dark' ? 'light' : 'dark'
          document.documentElement.classList.toggle('dark', next === 'dark')
          return { theme: next }
        }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    },
  ),
)

export { useAuthStore } from './auth'
export { useChannelStore } from './channel'
export { useMessageStore } from './message'
