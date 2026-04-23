import { Hash, Users, Bell, Pin, Search } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { useChannelStore } from '@/store/channelStore'
import { useMessageStore } from '@/store/message'
import { useUIStore } from '@/store/uiStore'
import { formatTime, cn } from '@/utils'

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

// ─── Single message ────────────────────────────────────────────────────────────

function MessageItem({ message, isGrouped }: {
    message: ReturnType<typeof useMessageStore.getState>['messages'][string][number]
    isGrouped: boolean
}) {
    const { openThread } = useUIStore()

    return (
        <div className={cn(
            'group relative flex gap-3 rounded-lg px-4 py-1 transition-colors hover:bg-nx-surface2',
            !isGrouped && 'mt-3'
        )}>
            {/* Avatar or spacer */}
            <div className="w-8 flex-shrink-0 pt-0.5">
                {!isGrouped ? (
                    <Avatar
                        initials={message.author.initials}
                        name={message.author.name}
                        size="sm"
                    />
                ) : (
                    <span className="block pt-1 text-right text-2xs text-nx-subtle opacity-0 transition-opacity group-hover:opacity-100">
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
                    </div>
                )}

                <p className="whitespace-pre-wrap break-words text-base text-nx-cream/90 leading-relaxed">
                    {message.content}
                </p>

                {/* Reactions */}
                {message.reactions.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                        {message.reactions.map((r: any) => (
                            <button
                                key={r.emoji}
                                className={cn(
                                    'flex items-center gap-1 rounded-full border px-2 py-0.5',
                                    'text-xs transition-colors hover:border-nx-indigo/50 hover:bg-nx-indigo/10',
                                    'border-nx-border bg-nx-surface2'
                                )}
                            >
                                <span>{r.emoji}</span>
                                <span className="text-nx-muted">{r.count}</span>
                            </button>
                        ))}
                        <button className="flex items-center rounded-full border border-dashed border-nx-border px-2 py-0.5 text-xs text-nx-subtle hover:border-nx-border2 hover:text-nx-muted">
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
                'absolute right-3 top-1 flex items-center gap-0.5 rounded-lg border border-nx-border',
                'bg-nx-surface px-1 py-0.5 opacity-0 shadow-glow-sm transition-opacity group-hover:opacity-100'
            )}>
                {['👍', '❤️', '😂'].map((emoji) => (
                    <button
                        key={emoji}
                        className="rounded px-1 py-0.5 text-sm hover:bg-nx-surface2"
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

function MessageList() {
    const { activeChannelId } = useChannelStore()
    const { getChannelMessages } = useMessageStore()

    const messages = activeChannelId ? getChannelMessages(activeChannelId) : []

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
        <div className="flex flex-1 flex-col justify-end overflow-y-auto px-2 py-4">
            {messages.map((msg: any, i: number) => {
                const prev = messages[i - 1]
                const isGrouped =
                    !!prev &&
                    prev.authorId === msg.authorId &&
                    new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000

                return <MessageItem key={msg.id} message={msg} isGrouped={isGrouped} />
            })}
        </div>
    )
}

// ─── Message composer ──────────────────────────────────────────────────────────

function Composer() {
    const { activeChannelId, getChannel } = useChannelStore()
    const channel = activeChannelId ? getChannel(activeChannelId) : null

    return (
        <div className="flex-shrink-0 px-4 pb-4">
            <div className={cn(
                'flex items-end gap-2 rounded-xl border border-nx-border bg-nx-surface2',
                'px-3 py-2.5 transition-colors focus-within:border-nx-border2'
            )}>
                <textarea
                    rows={1}
                    placeholder={`Message #${channel?.name ?? '...'}`}
                    className={cn(
                        'max-h-40 flex-1 resize-none bg-transparent text-base text-nx-cream',
                        'placeholder-nx-subtle outline-none leading-relaxed'
                    )}
                    onInput={(e) => {
                        const el = e.currentTarget
                        el.style.height = 'auto'
                        el.style.height = `${el.scrollHeight}px`
                    }}
                />
                <button className={cn(
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
                    'bg-nx-indigo text-white transition-all hover:bg-nx-indigo-d active:scale-95',
                    'disabled:opacity-40'
                )}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

// ─── Chat page root ────────────────────────────────────────────────────────────

export default function ChatPage() {
    return (
        <div className="flex h-full flex-col">
            <ChannelHeader />
            <MessageList />
            <Composer />
        </div>
    )
}