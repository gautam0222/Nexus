import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Bell, Hash, MoreHorizontal, Pin,
  Search, SendHorizonal, Smile, Users,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Tooltip } from '@/components/ui/Tooltip'
import { useChannelStore } from '@/store/channelStore'
import { useMessageStore } from '@/store/message'
import { useUIStore } from '@/store/uiStore'
import { formatTime, formatDateDivider, cn } from '@/utils'
import type { Message, Reaction } from '@/types'

// ─── Tiny icon button ─────────────────────────────────────────────────────────
function IconBtn({
  children, onClick, label, active,
}: {
  children: React.ReactNode
  onClick?: () => void
  label: string
  active?: boolean
}) {
  return (
    <Tooltip content={label} side="bottom" delayDuration={400}>
      <button
        onClick={onClick}
        aria-label={label}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-100',
          'text-nx-muted hover:bg-nx-overlay hover:text-nx-secondary',
          active && 'bg-nx-violet-dim text-nx-violet-hi',
        )}
      >
        {children}
      </button>
    </Tooltip>
  )
}

// ─── Channel header ────────────────────────────────────────────────────────────
function ChannelHeader() {
  const { activeChannelId, getChannel } = useChannelStore()
  const { toggleRightPanel, rightPanelOpen } = useUIStore()
  const channel = activeChannelId ? getChannel(activeChannelId) : null
  if (!channel) return null

  return (
    <header
      className="flex shrink-0 items-center gap-3 px-5 py-2.5 pl-12"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.045)' }}
    >
      {/* Left: channel name */}
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <Hash size={15} strokeWidth={2.5} className="shrink-0 text-nx-muted" />
        <h1 className="truncate text-md font-semibold text-nx-primary leading-none">
          {channel.name}
        </h1>
        {channel.description && (
          <>
            <span className="shrink-0 text-nx-ghost">│</span>
            <p className="truncate text-sm text-nx-muted">{channel.description}</p>
          </>
        )}
      </div>

      {/* Right: action strip */}
      <div className="flex shrink-0 items-center gap-0.5">
        <IconBtn label="Search channel"><Search size={14} /></IconBtn>
        <IconBtn label="Pinned messages"><Pin size={14} /></IconBtn>
        <IconBtn label="Notifications"><Bell size={14} /></IconBtn>
        <IconBtn
          label={rightPanelOpen ? 'Hide members' : 'Show members'}
          onClick={toggleRightPanel}
          active={rightPanelOpen}
        >
          <Users size={14} />
        </IconBtn>
        {/* Member count pill */}
        <span
          className="ml-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-nx-muted"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {channel.memberCount}
        </span>
      </div>
    </header>
  )
}

// ─── Date divider ──────────────────────────────────────────────────────────────
function DateDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.045)' }} />
      <span
        className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-nx-muted"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.055)' }}
      >
        {formatDateDivider(date)}
      </span>
      <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.045)' }} />
    </div>
  )
}

// ─── Reaction pill ────────────────────────────────────────────────────────────
function ReactionPill({ r, onClick }: { r: Reaction; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-all duration-100"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.40)'
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.10)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
      }}
    >
      <span className="leading-none">{r.emoji}</span>
      <span className="font-medium text-nx-secondary">{r.count}</span>
    </button>
  )
}

// ─── Hover action bar ─────────────────────────────────────────────────────────
function HoverBar({
  onReact,
  onReply,
}: {
  onReact: (emoji: string) => void
  onReply: () => void
}) {
  return (
    <div
      className="absolute right-3 top-0.5 hidden items-center gap-px rounded-xl px-1 py-0.5 group-hover:flex animate-fade-in"
      style={{
        background: '#1D1D32',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.60)',
      }}
    >
      {['👍', '❤️', '😂', '🔥'].map((emoji) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="flex items-center justify-center rounded-lg px-1.5 py-1 text-sm transition-colors hover:bg-nx-overlay active:scale-90"
        >
          {emoji}
        </button>
      ))}
      <div className="mx-0.5 h-4 w-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <button
        onClick={onReply}
        className="rounded-lg px-2 py-1 text-xs font-medium text-nx-muted transition-colors hover:bg-nx-overlay hover:text-nx-secondary"
      >
        Reply
      </button>
      <button className="rounded-lg p-1 text-nx-muted transition-colors hover:bg-nx-overlay hover:text-nx-secondary">
        <MoreHorizontal size={13} />
      </button>
    </div>
  )
}

// ─── Single message ────────────────────────────────────────────────────────────
function MessageItem({
  message,
  isGrouped,
  channelId,
}: {
  message: Message
  isGrouped: boolean
  channelId: string
}) {
  const { openThread } = useUIStore()
  const { addReaction } = useMessageStore()

  const handleReact = (emoji: string) => addReaction(channelId, message.id, emoji)

  return (
    <div className={cn('msg-row group relative', !isGrouped && 'mt-2')}>

      {/* Avatar column */}
      <div className="w-8 shrink-0 pt-0.5">
        {!isGrouped ? (
          <Avatar initials={message.author.initials} name={message.author.name} size="sm" />
        ) : (
          // Timestamp visible on hover
          <span className="block text-right text-[10px] leading-tight text-nx-ghost opacity-0 transition-opacity group-hover:opacity-100 pt-1">
            {formatTime(message.createdAt)}
          </span>
        )}
      </div>

      {/* Message body */}
      <div className="min-w-0 flex-1 overflow-hidden">
        {!isGrouped && (
          <div className="mb-0.5 flex items-baseline gap-2">
            <span className="text-sm font-semibold text-nx-primary">
              {message.author.name}
            </span>
            <span className="text-[10px] text-nx-muted">
              {formatTime(message.createdAt)}
            </span>
            {message.isPinned && <Pin size={9} className="text-nx-amber" />}
            {message.isEdited && (
              <span className="text-[10px] text-nx-ghost italic">(edited)</span>
            )}
          </div>
        )}

        {/* Content */}
        <p className="whitespace-pre-wrap break-words text-base leading-relaxed text-nx-secondary">
          {message.content}
        </p>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {message.reactions.map((r: Reaction) => (
              <ReactionPill key={r.emoji} r={r} onClick={() => handleReact(r.emoji)} />
            ))}
            <button
              className="flex items-center rounded-full px-2 py-0.5 text-xs text-nx-ghost transition-colors hover:text-nx-muted"
              style={{ border: '1px dashed rgba(255,255,255,0.08)' }}
            >
              <Smile size={11} />
            </button>
          </div>
        )}

        {/* Thread replies */}
        {message.replyCount > 0 && (
          <button
            onClick={() => openThread(message.id)}
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-nx-violet-hi hover:underline underline-offset-2"
          >
            <span>{message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}</span>
          </button>
        )}
      </div>

      {/* Hover action bar */}
      <HoverBar
        onReact={handleReact}
        onReply={() => openThread(message.id)}
      />
    </div>
  )
}

// ─── Message list ──────────────────────────────────────────────────────────────
function MessageList({ channelId }: { channelId: string }) {
  const { getChannelMessages } = useMessageStore()
  const messages  = getChannelMessages(channelId)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.20)' }}
        >
          <Hash size={26} className="text-nx-violet-hi" />
        </div>
        <div>
          <p className="text-md font-semibold text-nx-primary">No messages yet</p>
          <p className="mt-1 text-sm text-nx-muted">Be the first to say something.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-3 py-2">
      {messages.map((msg, i) => {
        const prev = messages[i - 1]

        const showDate =
          !prev ||
          new Date(msg.createdAt).toDateString() !== new Date(prev.createdAt).toDateString()

        const isGrouped =
          !showDate &&
          !!prev &&
          prev.authorId === msg.authorId &&
          new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60_000

        return (
          <div key={msg.id}>
            {showDate && <DateDivider date={msg.createdAt} />}
            <MessageItem message={msg} isGrouped={isGrouped} channelId={channelId} />
          </div>
        )
      })}
      <div ref={bottomRef} className="h-2" />
    </div>
  )
}

// ─── Composer ─────────────────────────────────────────────────────────────────
function Composer({ channelId, channelName }: { channelId: string; channelName: string }) {
  const [value, setValue]    = useState('')
  const { sendMessage }      = useMessageStore()
  const textareaRef          = useRef<HTMLTextAreaElement>(null)

  const submit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed) return
    sendMessage(channelId, trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [value, channelId, sendMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const canSend = value.trim().length > 0

  return (
    <div className="shrink-0 px-4 pb-4 pt-2">
      <div className="composer-wrap px-3 py-2.5">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channelName}`}
            className="max-h-40 flex-1 resize-none bg-transparent text-base text-nx-primary leading-relaxed outline-none placeholder:text-nx-ghost"
          />
          {/* Send button — only glows when there's content */}
          <Tooltip content="Send · Enter" side="top" delayDuration={400}>
            <button
              onClick={submit}
              disabled={!canSend}
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-150',
                canSend
                  ? 'text-white active:scale-95'
                  : 'cursor-not-allowed opacity-30',
              )}
              style={canSend ? {
                background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                boxShadow: '0 0 16px rgba(139,92,246,0.50)',
              } : {
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <SendHorizonal size={15} />
            </button>
          </Tooltip>
        </div>
      </div>
      {/* Hints */}
      <p className="mt-1.5 px-1 text-[10px] text-nx-ghost">
        <kbd className="rounded border border-nx-edge px-1 font-mono text-nx-ghost">Enter</kbd> send
        &nbsp;·&nbsp;
        <kbd className="rounded border border-nx-edge px-1 font-mono text-nx-ghost">⇧ Enter</kbd> new line
      </p>
    </div>
  )
}

// ─── Chat page root ────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { activeChannelId, getChannel } = useChannelStore()
  const channel = activeChannelId ? getChannel(activeChannelId) : null

  return (
    <div className="flex h-full flex-col bg-nx-base">
      <ChannelHeader />

      {activeChannelId ? (
        <>
          <MessageList channelId={activeChannelId} />
          <Composer
            channelId={activeChannelId}
            channelName={channel?.name ?? '...'}
          />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-nx-muted">Select a channel to start chatting</p>
        </div>
      )}
    </div>
  )
}