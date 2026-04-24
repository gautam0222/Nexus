import { X } from 'lucide-react'
import { useUIStore } from '@/store'
import { useMessageStore } from '@/store/message'
import { useChannelStore } from '@/store/channelStore'
import { MOCK_USERS } from '@/mockData'
import { MessageItem } from './MessageItem'
import { Composer } from './Composer'
import type { Message } from '@/types'
import { cn } from '@/utils'

// Fake replies for demo
function getMockReplies(parentId: string, allMessages: Message[]): Message[] {
  const parent = allMessages.find((m) => m.id === parentId)
  if (!parent) return []
  return [
    {
      ...parent, id: `${parentId}-r1`,
      authorId: MOCK_USERS[2].id, author: MOCK_USERS[2],
      content: 'Totally agree — the spacing tokens map perfectly to our 4px grid.',
      reactions: [], replyCount: 0,
      createdAt: new Date(new Date(parent.createdAt).getTime() + 3 * 60_000).toISOString(),
    },
  ]
}

export function ThreadPanel() {
  const { threadPanelOpen, activeThreadId, closeThread } = useUIStore()
  const { messages } = useMessageStore()
  const { activeChannelId } = useChannelStore()

  const allMessages = Object.values(messages).flat()
  const parentMessage = allMessages.find((m) => m.id === activeThreadId) ?? null
  const replies = activeThreadId ? getMockReplies(activeThreadId, allMessages) : []

  return (
    <div
      className={cn(
        'flex h-full shrink-0 flex-col border-l overflow-hidden transition-all duration-200',
        threadPanelOpen ? 'w-72' : 'w-0',
      )}
      style={{ background: '#1e2124', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center justify-between border-b px-4 py-3 shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <h2 className="text-sm font-semibold text-hi">Thread</h2>
        <button onClick={closeThread} className="text-dim hover:text-lo transition-colors">
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {parentMessage && (
          <div className="border-b pb-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <MessageItem message={parentMessage} isGrouped={false} isHighlighted />
          </div>
        )}
        <div className="flex items-center gap-3 px-4 py-2.5">
          <span className="text-xs font-semibold text-dim">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
          <div className="h-px flex-1 bg-line" />
        </div>
        {replies.map((reply, i) => (
          <MessageItem key={reply.id} message={reply} isGrouped={i > 0 && replies[i-1].authorId === reply.authorId} />
        ))}
        {replies.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-sm text-dim">No replies yet</p>
          </div>
        )}
      </div>

      {parentMessage && (
        <div className="shrink-0 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Composer channelId={activeChannelId ?? undefined} placeholder="Reply in thread…" />
        </div>
      )}
    </div>
  )
}
