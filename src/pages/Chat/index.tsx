import { useEffect, useRef, useState, useCallback } from 'react'
import { MoreHorizontal, Search, SendHorizonal, Smile, Users } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { useChannelStore } from '@/store/channelStore'
import { useMessageStore } from '@/store/message'
import { useUIStore } from '@/store/uiStore'
import { formatTime, formatDateDivider, cn } from '@/utils'
import type { Message, Reaction } from '@/types'

// ─── User neon palette ────────────────────────────────────────────────────────
const USER_NEON: Record<string, { hex: string; glow: string; label: string }> = {
  u1: { hex: '#FF0055', glow: 'rgba(255,0,85,0.28)',   label: 'PINK'   },
  u2: { hex: '#00EEFF', glow: 'rgba(0,238,255,0.28)',  label: 'CYAN'   },
  u3: { hex: '#BBFF00', glow: 'rgba(187,255,0,0.25)',  label: 'LIME'   },
  u4: { hex: '#9D00FF', glow: 'rgba(157,0,255,0.28)',  label: 'PURPLE' },
  u5: { hex: '#FF8800', glow: 'rgba(255,136,0,0.28)',  label: 'AMBER'  },
  u6: { hex: '#00FFB2', glow: 'rgba(0,255,178,0.25)',  label: 'TEAL'   },
}
function getUserNeon(userId: string) {
  return USER_NEON[userId] ?? USER_NEON.u2
}

// ─── Floating glass HUD header ────────────────────────────────────────────────
function FloatingHUD() {
  const { activeChannelId, getChannel } = useChannelStore()
  const { toggleRightPanel, rightPanelOpen, openSearch } = useUIStore()
  const channel = activeChannelId ? getChannel(activeChannelId) : null
  if (!channel) return null

  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-30 flex items-center gap-2">
      {/* Channel pill — glass */}
      <div
        className="hud-glass pointer-events-auto flex flex-1 items-center gap-2.5 overflow-hidden px-3 py-2"
        style={{ minWidth: 0 }}
      >
        {/* Neon hash cursor */}
        <span
          className="shrink-0 font-mono text-sm font-bold"
          style={{ color: '#00EEFF', textShadow: '0 0 10px rgba(0,238,255,0.80)' }}
        >
          #
        </span>
        <span className="truncate font-mono text-sm font-bold text-white">
          {channel.name}
        </span>
        {channel.description && (
          <>
            <span className="shrink-0 font-mono text-xs text-nx-ghost">──</span>
            <span className="truncate font-mono text-xs text-nx-dim">{channel.description}</span>
          </>
        )}
        {/* Member count chip */}
        <span
          className="ml-auto shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px]"
          style={{
            background: 'rgba(0,238,255,0.08)',
            border: '1px solid rgba(0,238,255,0.15)',
            color: '#00EEFF',
          }}
        >
          {channel.memberCount}m
        </span>
      </div>

      {/* Action buttons — glass pills */}
      <div className="hud-glass pointer-events-auto flex shrink-0 items-center gap-0.5 px-1.5 py-1">
        <Tooltip content="Search" side="bottom" delayDuration={400}>
          <button
            onClick={openSearch}
            className="flex h-6 w-6 items-center justify-center rounded text-nx-dim transition-colors hover:text-nx-cyan"
          >
            <Search size={13} />
          </button>
        </Tooltip>
        <Tooltip content="Members" side="bottom" delayDuration={400}>
          <button
            onClick={toggleRightPanel}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded transition-colors',
              rightPanelOpen ? 'text-nx-cyan' : 'text-nx-dim hover:text-nx-cyan',
            )}
          >
            <Users size={13} />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

// ─── Date divider ──────────────────────────────────────────────────────────────
function DateDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 px-2 py-3">
      <div className="h-px flex-1" style={{ background: 'rgba(0,238,255,0.06)' }} />
      <span
        className="rounded-full px-3 py-0.5 font-mono text-[9px] tracking-widest text-nx-dim"
        style={{
          background: 'rgba(0,238,255,0.05)',
          border: '1px solid rgba(0,238,255,0.10)',
        }}
      >
        {formatDateDivider(date).toUpperCase()}
      </span>
      <div className="h-px flex-1" style={{ background: 'rgba(0,238,255,0.06)' }} />
    </div>
  )
}

// ─── Reaction pill ─────────────────────────────────────────────────────────────
function ReactionPill({
  r,
  onClick,
  userColor,
}: {
  r: Reaction
  onClick: () => void
  userColor: string
}) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-all duration-100"
      style={{
        background: hov ? `${userColor}18` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hov ? userColor + '55' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hov ? `0 0 8px ${userColor}30` : 'none',
        transform: hov ? 'scale(1.06)' : 'scale(1)',
      }}
    >
      <span>{r.emoji}</span>
      <span className="font-mono text-[10px] text-nx-fog">{r.count}</span>
    </button>
  )
}

// ─── Hover action bar ──────────────────────────────────────────────────────────
function HoverBar({
  onReact,
  onReply,
  userColor,
}: {
  onReact: (emoji: string) => void
  onReply: () => void
  userColor: string
}) {
  return (
    <div
      className="absolute right-3 -top-4 hidden items-center gap-px rounded-xl px-1.5 py-1 group-hover:flex animate-fade-in"
      style={{
        background: '#0D0D25',
        border: '1px solid rgba(0,238,255,0.12)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.85)',
      }}
    >
      {['👍', '❤️', '😂', '🔥', '🚀'].map((emoji) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="rounded-lg px-1 py-0.5 text-sm transition-all hover:bg-nx-overlay active:scale-90"
        >
          {emoji}
        </button>
      ))}
      <div className="mx-1 h-3 w-px" style={{ background: 'rgba(0,238,255,0.10)' }} />
      <button
        onClick={onReply}
        className="rounded-lg px-2 py-0.5 font-mono text-[10px] transition-colors hover:bg-nx-overlay"
        style={{ color: userColor }}
      >
        REPLY
      </button>
      <button className="rounded-lg p-0.5 text-nx-dim hover:bg-nx-overlay hover:text-nx-fog">
        <MoreHorizontal size={12} />
      </button>
    </div>
  )
}

// ─── Message card ──────────────────────────────────────────────────────────────
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
  const neon = getUserNeon(message.authorId)

  const handleReact = (emoji: string) => addReaction(channelId, message.id, emoji)

  return (
    <div
      className={cn('msg-card group relative', !isGrouped && 'mt-2')}
      style={{
        borderLeftColor: neon.hex,
        boxShadow: `inset 3px 0 16px ${neon.glow}`,
      }}
    >
      {/* Header row */}
      {!isGrouped && (
        <div className="mb-1 flex items-baseline gap-3">
          {/* Author name — neon colored */}
          <span
            className="text-sm font-bold"
            style={{
              color: neon.hex,
              textShadow: `0 0 10px ${neon.glow}`,
            }}
          >
            {message.author.name.toUpperCase()}
          </span>
          {/* Timestamp — monospace */}
          <span className="font-mono text-[10px] text-nx-dim">
            {formatTime(message.createdAt)}
          </span>
          {/* System labels */}
          {message.isPinned && (
            <span className="font-mono text-[9px]" style={{ color: '#BBFF00', textShadow: '0 0 6px rgba(187,255,0,0.60)' }}>
              ◆ PINNED
            </span>
          )}
          {message.isEdited && (
            <span className="font-mono text-[9px] text-nx-ghost italic">[edited]</span>
          )}
          {/* User color label — far right */}
          <span
            className="ml-auto font-mono text-[8px] tracking-widest opacity-30"
            style={{ color: neon.hex }}
          >
            {neon.label}
          </span>
        </div>
      )}

      {/* Grouped: just small timestamp on hover */}
      {isGrouped && (
        <div className="absolute left-0 -top-0 pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="font-mono text-[9px] text-nx-ghost">{formatTime(message.createdAt)}</span>
        </div>
      )}

      {/* Message text */}
      <p className="text-sm leading-relaxed text-nx-fog">{message.content}</p>

      {/* Reactions */}
      {message.reactions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {message.reactions.map((r: Reaction) => (
            <ReactionPill
              key={r.emoji}
              r={r}
              onClick={() => handleReact(r.emoji)}
              userColor={neon.hex}
            />
          ))}
          <button
            className="flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] text-nx-ghost transition-colors hover:text-nx-dim"
            style={{ border: '1px dashed rgba(0,238,255,0.10)' }}
          >
            <Smile size={10} />
          </button>
        </div>
      )}

      {/* Thread replies */}
      {message.replyCount > 0 && (
        <button
          onClick={() => openThread(message.id)}
          className="mt-1.5 font-mono text-[10px] transition-colors hover:underline underline-offset-2"
          style={{ color: neon.hex, textShadow: `0 0 6px ${neon.glow}` }}
        >
          ⌥ {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
        </button>
      )}

      {/* Hover bar */}
      <HoverBar onReact={handleReact} onReply={() => openThread(message.id)} userColor={neon.hex} />
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
      <div className="flex flex-1 flex-col items-center justify-center gap-4 pt-16">
        <div
          className="font-mono text-[10px] tracking-widest"
          style={{ color: 'rgba(0,238,255,0.20)' }}
        >
          ─── CHANNEL INITIALIZED ───
        </div>
        <p className="font-mono text-xs text-nx-ghost">No transmissions yet. Be the first.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-3 pt-16 pb-2 no-scrollbar">
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
      <div ref={bottomRef} className="h-1" />
    </div>
  )
}

// ─── Composer ─────────────────────────────────────────────────────────────────
function Composer({ channelId, channelName }: { channelId: string; channelName: string }) {
  const [value, setValue]   = useState('')
  const { sendMessage }     = useMessageStore()
  const textareaRef         = useRef<HTMLTextAreaElement>(null)
  const charCount           = value.length
  const maxChars            = 2000

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
    if (e.target.value.length > maxChars) return
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const canSend    = value.trim().length > 0
  const nearLimit  = charCount > maxChars * 0.85
  const overLimit  = charCount > maxChars * 0.95

  return (
    <div className="shrink-0 px-3 pb-3 pt-1">
      <div className="composer-wrap px-3 py-2.5">
        {/* Prompt prefix + textarea */}
        <div className="flex items-end gap-2">
          {/* Terminal prompt */}
          <span
            className="mb-[1px] shrink-0 font-mono text-sm font-bold"
            style={{
              color: '#00EEFF',
              textShadow: '0 0 8px rgba(0,238,255,0.70)',
            }}
          >
            $
          </span>

          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={`transmit to #${channelName}...`}
            className="max-h-40 flex-1 resize-none bg-transparent font-mono text-sm text-white leading-relaxed outline-none placeholder:font-mono placeholder:text-nx-ghost"
          />

          {/* Char count ring */}
          {charCount > 0 && (
            <span
              className={cn(
                'mb-0.5 shrink-0 font-mono text-[9px] transition-colors',
                overLimit ? 'text-nx-pink' : nearLimit ? 'text-nx-amber' : 'text-nx-ghost',
              )}
              style={overLimit ? { textShadow: '0 0 6px rgba(255,0,85,0.60)' } : {}}
            >
              {maxChars - charCount}
            </span>
          )}

          {/* Send */}
          <Tooltip content="TRANSMIT · Enter" side="top" delayDuration={400}>
            <button
              onClick={submit}
              disabled={!canSend}
              className={cn(
                'mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-150',
                canSend ? 'active:scale-90' : 'cursor-not-allowed opacity-20',
              )}
              style={canSend ? {
                background: 'linear-gradient(135deg, #FF0055, #9D00FF)',
                boxShadow: '0 0 16px rgba(255,0,85,0.55), 0 0 30px rgba(157,0,255,0.35)',
              } : { background: 'rgba(255,255,255,0.04)' }}
            >
              <SendHorizonal size={14} className="text-white" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-1 flex items-center gap-3 px-1">
        <span className="font-mono text-[9px] text-nx-ghost">
          <kbd className="rounded border border-nx-edge px-1">ENTER</kbd> TRANSMIT
          &nbsp;·&nbsp;
          <kbd className="rounded border border-nx-edge px-1">⇧ ENTER</kbd> NEW LINE
        </span>
        <span className="ml-auto font-mono text-[8px] text-nx-ghost">
          NEXUS // HYPERCORE
        </span>
      </div>
    </div>
  )
}

// ─── Chat page root ─────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { activeChannelId, getChannel } = useChannelStore()
  const channel = activeChannelId ? getChannel(activeChannelId) : null

  return (
    <div
      className="relative flex h-full flex-col"
      style={{ background: '#07071A' }}
    >
      {/* Floating HUD header — overlays messages */}
      <FloatingHUD />

      {activeChannelId ? (
        <>
          <MessageList channelId={activeChannelId} />
          <Composer
            channelId={activeChannelId}
            channelName={channel?.name ?? '...'}
          />
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 pt-16">
          <span className="font-mono text-[10px] tracking-widest" style={{ color: 'rgba(0,238,255,0.20)' }}>
            ─── SELECT CHANNEL ───
          </span>
          <p className="font-mono text-xs text-nx-ghost">Choose a channel from the left panel</p>
        </div>
      )}
    </div>
  )
}