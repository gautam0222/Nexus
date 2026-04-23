import { create } from 'zustand'
import { MOCK_CHANNELS, MOCK_TEAMS } from '@/mockData'
import type { Channel, Team } from '@/types'

interface ChannelState {
  teams: Team[]
  channels: Channel[]
  activeTeamId: string | null
  activeChannelId: string | null

  getTeamChannels: (teamId: string) => Channel[]
  getChannel: (channelId: string) => Channel | undefined

  setActiveTeam: (teamId: string) => void
  setActiveChannel: (channelId: string) => void
  markChannelRead: (channelId: string) => void
}

export const useChannelStore = create<ChannelState>()((set, get) => ({
  teams: MOCK_TEAMS,
  channels: MOCK_CHANNELS,
  activeTeamId: MOCK_TEAMS[0].id,
  activeChannelId: MOCK_CHANNELS[0].id,

  getTeamChannels: (teamId) => get().channels.filter((ch) => ch.teamId === teamId),

  getChannel: (channelId) => get().channels.find((ch) => ch.id === channelId),

  setActiveTeam: (teamId) => set({ activeTeamId: teamId }),

  setActiveChannel: (channelId) => set({ activeChannelId: channelId }),

  markChannelRead: (channelId) =>
    set((s) => ({
      channels: s.channels.map((ch) =>
        ch.id === channelId ? { ...ch, unreadCount: 0, hasMention: false } : ch,
      ),
    })),
}))
