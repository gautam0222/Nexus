import { useEffect, useRef, useState, useCallback } from 'react'
import { Hash, Users, Bell, Pin, Search, SendHorizonal } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { useChannelStore } from '@/store/channelStore'
import { useMessageStore } from '@/store/message'
import { useUIStore } from '@/store/uiStore'
import { formatTime, formatDateDivider, cn } from '@/utils'
import type { Message, Reaction } from '@/types'

// ─── Channel header ────────────────────────────────────────────────────────────

function ChannelHeader() {
    const { activeChannelId, getChannel } = useChannelStore()
    const { toggleRightPanel, rightPanelOpen } = useUIStore()
    const channel = activeChannelId ? getChannel(activeChannelId) : null

    if (!channel) return null

    return (
        <header className="flex flex-shrink-0 items-center gap-3 border-b border-nx-border px-4 py-3 pl-12">
            {/* Channel name */}
            <div className="flex flex-1 items-center gap-2 overflow-hidden">
                <Hash size={18} className="flex-shrink-0 text-nx-muted" />
                <h1 className="truncate text-md font-semibold text-nx-cream">{channel.name}</h1>
                {channel.description && (
                    <>
                        <span className="text-nx-border2">│</span>
                        <p className="truncate text-sm text-nx-muted">{channel.description}</p>
                    </>
                )}
            </div>

            {/* Right actions */}
            <div className="flex flex-shrink-0 items-center gap-1">
                <Tooltip content="Search in channel" side="bottom">
                    <Button variant="ghost" size="sm" icon={<Search size={15} />} />
                </Tooltip>
                <Tooltip content="Pinned messages" side="bottom">
                    <Button variant="ghost" size="sm" icon={<Pin size={15} />} />
                </Tooltip>
                <Tooltip content="Notifications" side="bottom">
                    <Button variant="ghost" size="sm" icon={<Bell size={15} />} />
                </Tooltip>
                <Tooltip content={rightPanelOpen ? 'Hide members' : 'Show members'} side="bottom">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={<Users size={15} />}
                        onClick={toggleRightPanel}
                        className={cn(rightPanelOpen && 'bg-nx-surface2 text-nx-cream')}
                    />
                </Tooltip>
                <span className="ml-1 text-xs text-nx-subtle">{channel.memberCount}</span>
            </div>
        </header>
    )
}

// ─── Date divider ──────────────────────────────────────────────────────────────

function DateDivider({ date }: { date: string }) {
    return (
        <div className="flex items-center gap-3 px-4 py-2">
            <div className="h-px flex-1 bg-nx-border" />
            <span className="text-xs font-medium text-nx-subtle">{formatDateDivider(date)}</span>
            <div className="h-px flex-1 bg-nx-border" />
        </div>
    )
}

// ─── Single message ────────────────────────────────────────────────────────────

function MessageItem({ message, isGrouped, channelId }: {
    message: Message
    isGrouped: boolean
    channelId: string
}) {
    const { openThread } = useUIStore()
    const { addReaction } = useMessageStore()

    const handleReaction = (emoji: string) => {
        addReaction(channelId, message.id, emoji)
    }

    return (
        <div className={cn(
            'group relative flex gap-3 rounded-lg px-4 py-1 transition-colors hover:bg-nx-surface2',
            !isGrouped && 'mt-3'
        )}>
            {/* Avatar or time-on-hover spacer */}
            <div className="w-8 flex-shrink-0 pt-0.5">
                {!isGrouped ? (
                    <Avatar
                        initials={message.author.initials}
                        name={message.author.name}
                        size="sm"
                    />
                ) : (
                    <span className="block pt-1 text-right text-[10px] leading-none text-nx-subtle opacity-0 transition-opacity group-hover:opacity-100">
                        {formatTime(message.createdAt)}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {!isGrouped && (
                    <div className="mb-0.5 flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-nx-cream">
                            {message.author.name}
                        </span>
                        <span className="text-xs text-nx-subtle">{formatTime(message.createdAt)}</span>
                        {message.isPinned && (
                            <Pin size={10} className="text-nx-amber" />
                        )}
                        {message.isEdited && (
                            <span className="text-[10px] text-nx-subtle italic">(edited)</span>
                        )}
                    </div>
                )}

                <p className="whitespace-pre-wrap break-words text-base text-nx-cream/90 leading-relaxed">
                    {message.content}
                </p>

                {/* Reactions */}
                {message.reactions.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                        {message.reactions.map((r: Reaction) => (
                            <button
                                key={r.emoji}
                                onClick={() => handleReaction(r.emoji)}
                                className={cn(
                                    'flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-all',
                                    'border-nx-border bg-nx-surface2 hover:border-nx-indigo/50 hover:bg-nx-indigo/10'
                                )}
                            >
                                <span>{r.emoji}</span>
                                <span className="text-nx-muted">{r.count}</span>
                            </button>
                        ))}
                        <button
                            onClick={() => { /* emoji picker TODO */ }}
                            className="flex items-center rounded-full border border-dashed border-nx-border px-2 py-0.5 text-xs text-nx-subtle hover:border-nx-border2 hover:text-nx-muted"
                        >
                            +
                        </button>
                    </div>
                )}

                {/* Thread reply count */}
                {message.replyCount > 0 && (
                    <button
                        onClick={() => openThread(message.id)}
                        className="mt-1 flex items-center gap-1.5 text-xs text-nx-indigo-l hover:underline"
                    >
                        <span>{message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}</span>
                    </button>
                )}
            </div>

            {/* Hover action bar */}
            <div className={cn(
                'absolute right-3 top-1 hidden items-center gap-0.5 rounded-lg border border-nx-border',
                'bg-nx-surface px-1 py-0.5 shadow-glow-sm group-hover:flex'
            )}>
                {['👍', '❤️', '😂'].map((emoji) => (
                    <button
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        className="rounded px-1 py-0.5 text-sm hover:bg-nx-surface2 active:scale-90 transition-transform"
                    >
                        {emoji}
                    </button>
                ))}
                <button
                    onClick={() => openThread(message.id)}
                    className="rounded px-1.5 py-0.5 text-xs text-nx-muted hover:bg-nx-surface2 hover:text-nx-cream"
                >
                    Reply
                </button>
            </div>
        </div>
    )
}

// ─── Message list ──────────────────────────────────────────────────────────────

function MessageList({ channelId }: { channelId: string }) {
    const { getChannelMessages } = useMessageStore()
    const messages = getChannelMessages(channelId)
    const bottomRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages.length])

    if (messages.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-nx-indigo/10">
                    <Hash size={28} className="text-nx-indigo-l" />
                </div>
                <div>
                    <p className="text-md font-semibold text-nx-cream">No messages yet</p>
                    <p className="mt-1 text-sm text-nx-muted">Be the first to say something!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col overflow-y-auto px-2 py-2">
            {messages.map((msg, i) => {
                const prev = messages[i - 1]

                // Show date divider when the day changes
                const showDateDivider =
                    !prev ||
                    new Date(msg.createdAt).toDateString() !== new Date(prev.createdAt).toDateString()

                // Group consecutive messages from same author within 5 min
                const isGrouped =
                    !showDateDivider &&
                    !!prev &&
                    prev.authorId === msg.authorId &&
                    new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000

                return (
                    <div key={msg.id}>
                        {showDateDivider && <DateDivider date={msg.createdAt} />}
                        <MessageItem
                            message={msg}
                            isGrouped={isGrouped}
                            channelId={channelId}
                        />
                    </div>
                )
            })}
            {/* Scroll anchor */}
            <div ref={bottomRef} className="h-2" />
        </div>
    )
}

// ─── Message composer ──────────────────────────────────────────────────────────

function Composer({ channelId, channelName }: { channelId: string; channelName: string }) {
    const [value, setValue] = useState('')
    const { sendMessage } = useMessageStore()
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const submit = useCallback(() => {
        const trimmed = value.trim()
        if (!trimmed) return
        sendMessage(channelId, trimmed)
        setValue('')
        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }, [value, channelId, sendMessage])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
        }
        // Shift+Enter inserts a newline (default behaviour, no need to intercept)
    }

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value)
        const el = e.target
        el.style.height = 'auto'
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }

    const canSend = value.trim().length > 0

    return (
        <div className="flex-shrink-0 px-4 pb-4 pt-2">
            <div className={cn(
                'flex items-end gap-2 rounded-xl border border-nx-border bg-nx-surface2 px-3 py-2.5',
                'transition-colors focus-within:border-nx-border2'
            )}>
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={value}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message #${channelName}`}
                    className={cn(
                        'max-h-40 flex-1 resize-none bg-transparent text-base text-nx-cream',
                        'placeholder-nx-subtle outline-none leading-relaxed'
                    )}
                />
                <Tooltip content="Send (Enter)" side="top">
                    <button
                        onClick={submit}
                        disabled={!canSend}
                        className={cn(
                            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
                            'transition-all active:scale-95',
                            canSend
                                ? 'bg-nx-indigo text-white hover:bg-nx-indigo-d'
                                : 'bg-nx-surface3 text-nx-subtle cursor-not-allowed opacity-50'
                        )}
                    >
                        <SendHorizonal size={15} />
                    </button>
                </Tooltip>
            </div>
            <p className="mt-1.5 px-1 text-[10px] text-nx-subtle">
                <kbd className="rounded border border-nx-border px-1 font-mono">Enter</kbd> to send &nbsp;·&nbsp;
                <kbd className="rounded border border-nx-border px-1 font-mono">Shift+Enter</kbd> for new line
            </p>
        </div>
    )
}

// ─── Chat page root ────────────────────────────────────────────────────────────

export default function ChatPage() {
    const { activeChannelId, getChannel } = useChannelStore()
    const channel = activeChannelId ? getChannel(activeChannelId) : null

    return (
        <div className="flex h-full flex-col">
            <ChannelHeader />
            {activeChannelId ? (
                <>
                    <MessageList channelId={activeChannelId} />
                    <Composer channelId={activeChannelId} channelName={channel?.name ?? '...'} />
                </>
            ) : (
                <div className="flex flex-1 items-center justify-center text-nx-muted text-sm">
                    Select a channel to start chatting
                </div>
            )}
        </div>
    )
}