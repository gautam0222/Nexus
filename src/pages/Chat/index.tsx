import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Bell, Hash, MoreHorizontal, Pin,
  Search, SendHorizonal, SmilePlus, Users,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Tooltip } from '@/components/ui/Tooltip'
import { useChannelStore } from '@/store/channelStore'
import { useMessageStore } from '@/store/message'
import { useUIStore } from '@/store/uiStore'
import { formatTime, formatDateDivider, cn } from '@/utils'
import type { Message, Reaction } from '@/types'

// ─── Icon button ──────────────────────────────────────────────────────────────
function IconBtn({
  children, onClick, label, active,
}: {
  children: React.ReactNode
  onClick?: () => void
  label: string
  active?: boolean
}) {
  return (
    <Tooltip content={label} side="bottom" delayDuration={350}>
      <button
        onClick={onClick}
        aria-label={label}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-md transition-all duration-100',
          'text-nx-muted hover:bg-nx-hover hover:text-nx-secondary',
          active && 'bg-nx-accent-dim text-nx-accent',
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
  const { toggleRightPanel, rightPanelOpen, openSearch } = useUIStore()
  const channel = activeChannelId ? getChannel(activeChannelId) : null
  if (!channel) return null

  return (
    <header
      className="flex shrink-0 items-center gap-3 px-5 py-2.5 pl-12"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <Hash size={15} strokeWidth={2} className="shrink-0 text-nx-muted" />
        <h1 className="truncate text-md font-semibold text-nx-primary">{channel.name}</h1>
        {channel.description && (
          <>
            <span className="shrink-0 text-nx-ghost text-sm">·</span>
            <p className="truncate text-sm text-nx-muted">{channel.description}</p>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <IconBtn label="Search" onClick={openSearch}><Search size={14} /></IconBtn>
        <IconBtn label="Pinned"><Pin size={14} /></IconBtn>
        <IconBtn label="Notifications"><Bell size={14} /></IconBtn>
        <IconBtn label={rightPanelOpen ? 'Hide members' : 'Members'} onClick={toggleRightPanel} active={rightPanelOpen}>
          <Users size={14} />
        </IconBtn>
        <span
          className="ml-2 rounded-md px-2 py-0.5 text-[11px] font-medium text-nx-muted"
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
      <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <span
        className="rounded-full px-2.5 py-0.5 text-[11px] text-nx-muted"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {formatDateDivider(date)}
      </span>
      <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
    </div>
  )
}

// ─── Reaction pill ─────────────────────────────────────────────────────────────
function ReactionPill({ r, onClick }: { r: Reaction; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-all duration-100 hover:border-nx-accent/40 hover:bg-nx-accent-dim"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <span>{r.emoji}</span>
      <span className="font-medium text-nx-muted">{r.count}</span>
    </button>
  )
}

// ─── Message hover bar ─────────────────────────────────────────────────────────
function HoverActions({
  onReact,
  onReply,
}: {
  onReact: (emoji: string) => void
  onReply: () => void
}) {
  return (
    <div
      className="absolute right-4 top-0 hidden items-center gap-px rounded-lg border px-1 py-0.5 group-hover:flex animate-fade-in"
      style={{
        background: '#1A1A1D',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.60)',
      }}
    >
      {['👍', '❤️', '😂'].map((emoji) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="rounded-md px-1.5 py-1 text-[14px] transition-colors hover:bg-nx-hover active:scale-95"
        >
          {emoji}
        </button>
      ))}
      <div className="mx-0.5 h-4 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
      <button
        onClick={onReply}
        className="rounded-md px-2 py-1 text-xs font-medium text-nx-muted transition-colors hover:bg-nx-hover hover:text-nx-secondary"
      >
        Reply
      </button>
      <button className="rounded-md p-1 text-nx-muted hover:bg-nx-hover hover:text-nx-secondary">
        <MoreHorizontal size={13} />
      </button>
    </div>
  )
}

// ─── Message row ──────────────────────────────────────────────────────────────
function MessageItem({ message, isGrouped, channelId }: {
  message: Message
  isGrouped: boolean
  channelId: string
}) {
  const { openThread } = useUIStore()
  const { addReaction } = useMessageStore()
  const handleReact = (emoji: string) => addReaction(channelId, message.id, emoji)

  return (
    <div className={cn('msg-row group', !isGrouped && 'mt-2')}>
      {/* Avatar col */}
      <div className="w-9 shrink-0 pt-0.5">
        {!isGrouped ? (
          <Avatar initials={message.author.initials} name={message.author.name} size="sm" />
        ) : (
          <span className="block pt-1 text-right text-[10px] text-nx-ghost opacity-0 transition-opacity group-hover:opacity-100">
            {formatTime(message.createdAt)}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        {!isGrouped && (
          <div className="mb-0.5 flex items-baseline gap-2">
            <span className="text-sm font-semibold text-nx-primary">{message.author.name}</span>
            <span className="text-[11px] text-nx-muted">{formatTime(message.createdAt)}</span>
            {message.isPinned && <Pin size={10} className="text-nx-amber" />}
            {message.isEdited && <span className="text-[11px] text-nx-ghost italic">(edited)</span>}
          </div>
        )}

        <p className="break-words text-sm leading-relaxed text-nx-secondary">
          {message.content}
        </p>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {message.reactions.map((r: Reaction) => (
              <ReactionPill key={r.emoji} r={r} onClick={() => handleReact(r.emoji)} />
            ))}
            <button
              className="flex items-center rounded-full px-2 py-0.5 text-nx-ghost transition-colors hover:text-nx-muted"
              style={{ border: '1px dashed rgba(255,255,255,0.08)' }}
            >
              <SmilePlus size={11} />
            </button>
          </div>
        )}

        {/* Thread count */}
        {message.replyCount > 0 && (
          <button
            onClick={() => openThread(message.id)}
            className="mt-1 text-[12px] font-medium text-nx-accent hover:underline underline-offset-2"
          >
            {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
          </button>
        )}
      </div>

      {/* Hover actions */}
      <HoverActions onReact={handleReact} onReply={() => openThread(message.id)} />
    </div>
  )
}

// ─── Message list ──────────────────────────────────────────────────────────────
function MessageList({ channelId }: { channelId: string }) {
  const { getChannelMessages } = useMessageStore()
  const messages  = getChannelMessages(channelId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: 'rgba(92,92,219,0.10)' }}
        >
          <Hash size={22} className="text-nx-accent" style={{ opacity: 0.6 }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-nx-primary">No messages yet</p>
          <p className="mt-0.5 text-xs text-nx-muted">Be the first to say something!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-3 py-3">
      {messages.map((msg, i) => {
        const prev      = messages[i - 1]
        const showDate  = !prev || new Date(msg.createdAt).toDateString() !== new Date(prev.createdAt).toDateString()
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
      <div ref={bottomRef} className="h-1" />
    </div>
  )
}

// ─── Composer ─────────────────────────────────────────────────────────────────
function Composer({ channelId, channelName }: { channelId: string; channelName: string }) {
  const [value, setValue]   = useState('')
  const { sendMessage }     = useMessageStore()
  const textareaRef         = useRef<HTMLTextAreaElement>(null)

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const canSend = value.trim().length > 0

  return (
    <div className="shrink-0 px-4 pb-4 pt-2">
      <div className="composer px-3 py-2.5">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channelName}`}
            className="max-h-40 flex-1 resize-none bg-transparent text-sm text-nx-primary leading-relaxed placeholder:text-nx-muted"
          />
          <Tooltip content="Send  Enter" side="top" delayDuration={300}>
            <button
              onClick={submit}
              disabled={!canSend}
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-100',
                canSend
                  ? 'bg-nx-accent text-white hover:bg-nx-accent-hover active:scale-95'
                  : 'text-nx-ghost cursor-not-allowed',
              )}
            >
              <SendHorizonal size={14} />
            </button>
          </Tooltip>
        </div>
      </div>
      <p className="mt-1.5 px-1 text-[11px] text-nx-ghost">
        <kbd className="rounded border border-nx-border px-1 font-mono text-[10px]">Enter</kbd> send
        &nbsp;·&nbsp;
        <kbd className="rounded border border-nx-border px-1 font-mono text-[10px]">⇧ Enter</kbd> new line
      </p>
    </div>
  )
}

// ─── Chat page ─────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { activeChannelId, getChannel } = useChannelStore()
  const channel = activeChannelId ? getChannel(activeChannelId) : null

  return (
    <div className="flex h-full flex-col bg-nx-base">
      <ChannelHeader />
      {activeChannelId ? (
        <>
          <MessageList channelId={activeChannelId} />
          <Composer channelId={activeChannelId} channelName={channel?.name ?? '...'} />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-nx-muted">Select a channel to start chatting</p>
        </div>
      )}
    </div>
  )
}