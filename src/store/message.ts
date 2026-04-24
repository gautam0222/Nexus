import { create } from 'zustand'
import type { Message } from '@/types'
import { MOCK_MESSAGES, CURRENT_USER } from '@/mockData'

interface MessageState {
  messages: Record<string, Message[]>
  getChannelMessages: (channelId: string) => Message[]
  sendMessage: (channelId: string, content: string, attachments?: import('@/types').FileAttachment[]) => void
  editMessage: (channelId: string, messageId: string, content: string) => void
  deleteMessage: (channelId: string, messageId: string) => void
  addReaction: (channelId: string, messageId: string, emoji: string) => void
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  messages: MOCK_MESSAGES.reduce<Record<string, Message[]>>((acc, msg) => {
    if (!acc[msg.channelId]) acc[msg.channelId] = []
    acc[msg.channelId].push(msg)
    return acc
  }, {}),

  getChannelMessages: (channelId) => get().messages[channelId] ?? [],

  sendMessage: (channelId, content, attachments = []) => {
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      channelId,
      authorId: CURRENT_USER.id,
      author: CURRENT_USER,
      content,
      type: 'text',
      reactions: [],
      attachments,
      replyCount: 0,
      isEdited: false,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((s) => ({
      messages: { ...s.messages, [channelId]: [...(s.messages[channelId] ?? []), newMsg] },
    }))
  },

  editMessage: (channelId, messageId, content) => {
    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: (s.messages[channelId] ?? []).map((m) =>
          m.id === messageId ? { ...m, content, isEdited: true, updatedAt: new Date().toISOString() } : m
        ),
      },
    }))
  },

  deleteMessage: (channelId, messageId) => {
    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: (s.messages[channelId] ?? []).filter((m) => m.id !== messageId),
      },
    }))
  },

  addReaction: (channelId, messageId, emoji) => {
    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: (s.messages[channelId] ?? []).map((m) => {
          if (m.id !== messageId) return m
          const existing = m.reactions.find((r) => r.emoji === emoji)
          if (existing) {
            return {
              ...m,
              reactions: m.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1, userIds: [...r.userIds, CURRENT_USER.id] } : r
              ),
            }
          }
          return { ...m, reactions: [...m.reactions, { emoji, count: 1, userIds: [CURRENT_USER.id] }] }
        }),
      },
    }))
  },
}))
