import { useRef, useEffect, useState } from 'react'
import { Hash, ChevronDown } from 'lucide-react'
import { useChannelStore } from '@/store/channelStore'
import { useMessageStore } from '@/store/message'
import { MessageItem } from './MessageItem'
import { formatDateDivider } from '@/utils'

// Date separator between message groups
function DateDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="flex-1 h-px bg-line" />
      <span className="text-xs font-medium text-dim shrink-0">{formatDateDivider(date)}</span>
      <div className="flex-1 h-px bg-line" />
    </div>
  )
}

// Mock typing indicator (simulated)
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-dim">
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-dim animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }} />
        ))}
      </span>
      <span>Priya is typing…</span>
    </div>
  )
}

function sameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

export function MessageList() {
  const { activeChannelId } = useChannelStore()
  const { getChannelMessages } = useMessageStore()
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showJumpBtn, setShowJumpBtn] = useState(false)

  const messages = activeChannelId ? getChannelMessages(activeChannelId) : []

  // Auto-scroll to bottom on new messages (only if near bottom)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    if (distFromBottom < 200) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length])

  // Show "jump to bottom" button when scrolled far up
  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowJumpBtn(dist > 400)
  }

  function jumpToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    setShowJumpBtn(false)
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface">
          <Hash size={22} className="text-dim" />
        </div>
        <p className="text-md font-semibold text-hi">No messages yet</p>
        <p className="text-sm text-dim">Be the first to say something!</p>
      </div>
    )
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto py-2 pb-4"
      >
        {messages.map((msg, i) => {
          const prev = messages[i - 1]
          const needsDateDivider = !prev || !sameDay(msg.createdAt, prev.createdAt)
          const isGrouped =
            !!prev &&
            !needsDateDivider &&
            prev.authorId === msg.authorId &&
            new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60_000

          return (
            <div key={msg.id}>
              {needsDateDivider && <DateDivider date={msg.createdAt} />}
              <MessageItem message={msg} isGrouped={isGrouped} />
            </div>
          )
        })}

        {/* Typing indicator */}
        <TypingIndicator />

        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Jump to bottom button */}
      {showJumpBtn && (
        <button
          onClick={jumpToBottom}
          className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-white shadow-lg hover:bg-brand-h transition-colors animate-fade-in"
        >
          <ChevronDown size={13} />
          Jump to bottom
        </button>
      )}
    </div>
  )
}
