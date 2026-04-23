import { create } from 'zustand'
import { MOCK_MESSAGES, CURRENT_USER } from '@/mockData'
import type { Message, Reaction } from '@/types'

interface MessageState {
  messages: Record<string, Message[]>

  getChannelMessages: (channelId: string) => Message[]

  sendMessage: (channelId: string, content: string) => void
  addReaction: (channelId: string, messageId: string, emoji: string) => void
  deleteMessage: (channelId: string, messageId: string) => void
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  messages: MOCK_MESSAGES.reduce((acc: Record<string, Message[]>, msg: Message) => {
    if (!acc[msg.channelId]) acc[msg.channelId] = []
    acc[msg.channelId].push(msg)
    return acc
  }, {}),

  getChannelMessages: (channelId) => get().messages[channelId] ?? [],

  sendMessage: (channelId, content) => {
    const trimmed = content.trim()
    if (!trimmed) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      channelId,
      authorId: CURRENT_USER.id,
      author: CURRENT_USER,
      content: trimmed,
      type: 'text',
      reactions: [],
      attachments: [],
      replyCount: 0,
      isEdited: false,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: [...(s.messages[channelId] ?? []), newMessage],
      },
    }))
  },

  addReaction: (channelId, messageId, emoji) => {
    set((s) => {
      const channelMsgs = s.messages[channelId] ?? []
      const updated = channelMsgs.map((msg) => {
        if (msg.id !== messageId) return msg

        const existing = msg.reactions.find((r: Reaction) => r.emoji === emoji)
        const alreadyReacted = existing?.userIds.includes(CURRENT_USER.id)

        let newReactions: Reaction[]
        if (!existing) {
          // add new reaction
          newReactions = [...msg.reactions, { emoji, count: 1, userIds: [CURRENT_USER.id] }]
        } else if (alreadyReacted) {
          // remove user's reaction — remove entry if count reaches 0
          newReactions = msg.reactions
            .map((r: Reaction) =>
              r.emoji === emoji
                ? { ...r, count: r.count - 1, userIds: r.userIds.filter((id) => id !== CURRENT_USER.id) }
                : r
            )
            .filter((r: Reaction) => r.count > 0)
        } else {
          // add current user to existing reaction
          newReactions = msg.reactions.map((r: Reaction) =>
            r.emoji === emoji
              ? { ...r, count: r.count + 1, userIds: [...r.userIds, CURRENT_USER.id] }
              : r
          )
        }

        return { ...msg, reactions: newReactions }
      })

      return { messages: { ...s.messages, [channelId]: updated } }
    })
  },

  deleteMessage: (channelId, messageId) => {
    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: (s.messages[channelId] ?? []).filter((m) => m.id !== messageId),
      },
    }))
  },
}))
