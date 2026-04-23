import { create } from 'zustand'
import { CURRENT_USER } from '@/mockData'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: CURRENT_USER,
  isAuthenticated: true,
  isLoading: false,

  login: async (_email, _password) => {
    set({ isLoading: true })
    await new Promise((r) => setTimeout(r, 500))
    set({ user: CURRENT_USER, isAuthenticated: true, isLoading: false })
  },

  logout: async () => {
    set({ user: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user }),
}))
