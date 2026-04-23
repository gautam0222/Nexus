import { create } from 'zustand'
import { MOCK_MESSAGES } from '@/mockData'
import type { Message } from '@/types'

interface MessageState {
  messages: Record<string, Message[]>

  getChannelMessages: (channelId: string) => Message[]

  sendMessage: (channelId: string, content: string) => void
  addReaction: (messageId: string, emoji: string, userId: string) => void
  deleteMessage: (messageId: string) => void
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  messages: MOCK_MESSAGES.reduce<Record<string, Message[]>>((acc, msg) => {
    if (!acc[msg.channelId]) acc[msg.channelId] = []
    acc[msg.channelId].push(msg)
    return acc
  }, {}),

  getChannelMessages: (channelId) => get().messages[channelId] ?? [],

  sendMessage: (channelId, content) => {
    console.log('[MessageStore] sendMessage stub', { channelId, content })
  },

  addReaction: (messageId, emoji, userId) => {
    console.log('[MessageStore] addReaction stub', { messageId, emoji, userId })
  },

  deleteMessage: (messageId) => {
    console.log('[MessageStore] deleteMessage stub', { messageId })
  },
}))
