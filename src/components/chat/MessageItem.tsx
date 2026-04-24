import { useState } from 'react'
import { Pencil, Trash2, SmilePlus, MessageSquare, Check, X } from 'lucide-react'
import { useUIStore } from '@/store'
import { useMessageStore } from '@/store/message'
import { useChannelStore } from '@/store/channelStore'
import { CURRENT_USER } from '@/mockData'
import { formatTime, formatBytes, cn } from '@/utils'
import type { Message } from '@/types'

// ─── Inline markdown renderer ─────────────────────────────────
function renderContent(text: string): React.ReactNode {
  // Split on block-level: code fences + blockquotes
  const lines = text.split('\n')
  return lines.map((line, li) => {
    // Blockquote
    if (line.startsWith('> ')) {
      return (
        <div key={li} className="my-1 border-l-2 border-line pl-3 text-lo italic">
          {renderInline(line.slice(2))}
        </div>
      )
    }
    // Bullet
    if (line.match(/^[-*] /)) {
      return <div key={li} className="flex gap-2 my-0.5"><span className="text-dim">•</span><span>{renderInline(line.slice(2))}</span></div>
    }
    // Numbered
    if (line.match(/^\d+\. /)) {
      const m = line.match(/^(\d+)\. (.*)/)
      if (m) return <div key={li} className="flex gap-2 my-0.5"><span className="text-dim">{m[1]}.</span><span>{renderInline(m[2])}</span></div>
    }
    return <span key={li}>{renderInline(line)}{li < lines.length - 1 && <br />}</span>
  })
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|_[^_]+_|\*[^*]+\*|~~[^~]+~~|\[([^\]]+)\]\(([^)]+)\)|@[\w\s]+)/g)
  return parts.map((part, i) => {
    if (!part) return null
    if (part.startsWith('```') && part.endsWith('```')) {
      return (
        <pre key={i} className="my-1 rounded bg-app px-3 py-2 text-xs font-mono text-hi overflow-x-auto">
          <code>{part.slice(3, -3).trim()}</code>
        </pre>
      )
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i} className="rounded bg-app px-1 py-0.5 text-xs font-mono text-hi">{part.slice(1, -1)}</code>
    }
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      return <strong key={i} className="font-semibold text-hi">{part.slice(2, -2)}</strong>
    }
    if ((part.startsWith('_') && part.endsWith('_')) || (part.startsWith('*') && part.endsWith('*'))) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>
    }
    if (part.startsWith('~~') && part.endsWith('~~')) {
      return <s key={i} className="text-dim">{part.slice(2, -2)}</s>
    }
    if (part.startsWith('@')) {
      return <span key={i} className="text-brand font-medium hover:underline cursor-pointer">{part}</span>
    }
    // URL link [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-brand underline hover:text-brand-h">{linkMatch[1]}</a>
    }
    return part
  })
}

// ─── Quick reaction picker ────────────────────────────────────
const QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '😮', '😢']

function QuickReactPicker({ onSelect }: { onSelect: (e: string) => void }) {
  return (
    <div className="absolute bottom-full right-0 mb-1 flex items-center gap-1 rounded-lg border border-line bg-surface px-2 py-1.5 shadow-lg z-50 animate-fade-in">
      {QUICK_EMOJIS.map((e) => (
        <button key={e} onClick={() => onSelect(e)} className="text-base hover:scale-125 transition-transform">
          {e}
        </button>
      ))}
    </div>
  )
}

// ─── MessageItem ──────────────────────────────────────────────
export function MessageItem({ message, isGrouped, isHighlighted }: {
  message: Message
  isGrouped: boolean
  isHighlighted?: boolean
}) {
  const { openThread } = useUIStore()
  const { addReaction, editMessage, deleteMessage } = useMessageStore()
  const { activeChannelId } = useChannelStore()

  const [showReactPicker, setShowReactPicker] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(message.content)

  const isOwn = message.authorId === CURRENT_USER.id
  const channelId = activeChannelId ?? message.channelId

  function handleReact(emoji: string) {
    addReaction(channelId, message.id, emoji)
    setShowReactPicker(false)
  }

  function saveEdit() {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== message.content) {
      editMessage(channelId, message.id, trimmed)
    }
    setIsEditing(false)
  }

  function handleEditKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit() }
    if (e.key === 'Escape') { setEditText(message.content); setIsEditing(false) }
  }

  return (
    <div className={cn(
      'msg-row group relative',
      !isGrouped && 'mt-3',
      isHighlighted && 'bg-brand/5',
    )}>
      {/* Avatar / time gutter */}
      <div className="w-10 shrink-0">
        {!isGrouped ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-sm font-semibold text-hi">
            {message.author.initials}
          </div>
        ) : (
          <span className="block pt-1 text-right text-2xs text-dim opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(message.createdAt).replace(' AM', '').replace(' PM', '')}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {!isGrouped && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-sm font-semibold text-hi">{message.author.name}</span>
            <span className="text-2xs text-dim">{formatTime(message.createdAt)}</span>
            {message.isPinned && <span className="text-2xs text-warn">📌 pinned</span>}
          </div>
        )}

        {/* Content or edit box */}
        {isEditing ? (
          <div>
            <textarea
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleEditKeyDown}
              className="w-full rounded bg-hover px-3 py-2 text-base text-hi outline-none resize-none border border-brand/40"
              rows={3}
            />
            <div className="mt-1 flex items-center gap-2 text-xs text-dim">
              <button onClick={saveEdit} className="flex items-center gap-1 text-success hover:text-success/80">
                <Check size={12} /> Save
              </button>
              <button onClick={() => { setEditText(message.content); setIsEditing(false) }} className="flex items-center gap-1 hover:text-lo">
                <X size={12} /> Cancel
              </button>
              <span className="ml-1 text-dim">Esc to cancel · Enter to save</span>
            </div>
          </div>
        ) : (
          <div className="text-base text-lo leading-relaxed">
            {renderContent(message.content)}
            {message.isEdited && <span className="ml-1 text-2xs text-dim">(edited)</span>}
          </div>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((file) => (
              <a
                key={file.id}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-line bg-surface p-2 hover:border-brand/40 hover:bg-brand/5 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-hover">
                  {file.mimeType.startsWith('image/') ? (
                    <img src={file.url} alt={file.name} className="h-full w-full rounded object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-dim uppercase">{file.name.split('.').pop() || 'FILE'}</span>
                  )}
                </div>
                <div className="flex flex-col pr-2">
                  <span className="text-sm font-medium text-hi max-w-[200px] truncate group-hover:text-brand">{file.name}</span>
                  <span className="text-xs text-dim">{formatBytes(file.size ?? 0)}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {message.reactions.map((r) => (
              <button
                key={r.emoji}
                onClick={() => handleReact(r.emoji)}
                className="flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5 text-xs hover:border-brand/50 hover:bg-brand/10 transition-colors"
              >
                <span>{r.emoji}</span>
                <span className="text-dim font-medium">{r.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Thread count */}
        {message.replyCount > 0 && (
          <button onClick={() => openThread(message.id)} className="mt-1 flex items-center gap-1 text-xs text-brand hover:underline">
            <MessageSquare size={11} />
            {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
          </button>
        )}
      </div>

      {/* Hover action bar */}
      <div className="absolute -top-3 right-4 flex items-center gap-0.5 rounded-md border border-line bg-surface shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {/* React */}
        <div className="relative">
          <button
            onClick={() => setShowReactPicker((s) => !s)}
            className="flex h-7 w-7 items-center justify-center rounded text-dim hover:bg-hover hover:text-lo transition-colors text-sm"
            title="Add reaction"
          >
            <SmilePlus size={14} />
          </button>
          {showReactPicker && (
            <QuickReactPicker onSelect={handleReact} />
          )}
        </div>

        {/* Reply in thread */}
        <button
          onClick={() => openThread(message.id)}
          className="flex h-7 w-7 items-center justify-center rounded text-dim hover:bg-hover hover:text-lo transition-colors"
          title="Reply in thread"
        >
          <MessageSquare size={14} />
        </button>

        {/* Edit (own only) */}
        {isOwn && (
          <button
            onClick={() => { setIsEditing(true); setEditText(message.content) }}
            className="flex h-7 w-7 items-center justify-center rounded text-dim hover:bg-hover hover:text-lo transition-colors"
            title="Edit message"
          >
            <Pencil size={13} />
          </button>
        )}

        {/* Delete (own only) */}
        {isOwn && (
          <button
            onClick={() => deleteMessage(channelId, message.id)}
            className="flex h-7 w-7 items-center justify-center rounded text-dim hover:bg-hover hover:text-danger transition-colors"
            title="Delete message"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
