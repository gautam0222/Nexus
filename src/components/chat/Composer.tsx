import { useState, useRef, useCallback } from 'react'
import { Send, Smile, Paperclip, Bold, Italic, Code, Strikethrough, Link2, AtSign, X as XIcon, FileIcon } from 'lucide-react'
import { useChannelStore } from '@/store/channelStore'
import { useMessageStore } from '@/store/message'
import { EmojiPicker } from '../ui/EmojiPicker'
import { MOCK_USERS } from '@/mockData'
import { cn, formatBytes } from '@/utils'
import type { User, FileAttachment } from '@/types'

function wrap(text: string, ss: number, se: number, before: string, after: string) {
  const sel = text.slice(ss, se) || 'text'
  return {
    text: text.slice(0, ss) + before + sel + after + text.slice(se),
    cursor: [ss + before.length, ss + before.length + sel.length] as [number, number],
  }
}

function MentionDropdown({ query, onSelect }: { query: string; onSelect: (u: User) => void }) {
  const users = MOCK_USERS.filter((u) => u.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
  if (!users.length) return null
  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg border border-line bg-surface shadow-xl z-50 overflow-hidden animate-fade-in">
      <p className="px-3 py-1.5 text-2xs font-semibold uppercase tracking-wider text-dim border-b border-line">Members</p>
      {users.map((u) => (
        <button
          key={u.id}
          onMouseDown={(e) => { e.preventDefault(); onSelect(u) }}
          className="flex w-full items-center gap-2.5 px-3 py-2 hover:bg-hover transition-colors"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-hover text-xs font-semibold text-hi">
            {u.initials}
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-sm font-medium text-hi truncate">{u.name}</p>
            {u.title && <p className="text-2xs text-dim truncate">{u.title}</p>}
          </div>
          <span className={cn('h-2 w-2 rounded-full shrink-0',
            u.status === 'online' ? 'bg-online' : u.status === 'busy' ? 'bg-busy' : 'bg-offline'
          )} />
        </button>
      ))}
    </div>
  )
}

export function Composer({ channelId, placeholder, isThread = false, onSend }: {
  channelId?: string
  placeholder?: string
  isThread?: boolean
  onSend?: () => void
}) {
  const [text, setText] = useState('')
  const [showToolbar, setShowToolbar] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { activeChannelId, getChannel } = useChannelStore()
  const { sendMessage } = useMessageStore()
  const targetId = channelId ?? activeChannelId
  const channel = targetId ? getChannel(targetId) : null

  const resize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    setText(val)
    resize()
    const before = val.slice(0, e.target.selectionStart)
    const match = before.match(/@(\w*)$/)
    setMentionQuery(match ? match[1] : null)
  }

  function insertMention(user: User) {
    const el = textareaRef.current
    if (!el) return
    const pos = el.selectionStart
    const mentionStart = text.slice(0, pos).lastIndexOf('@')
    setText(text.slice(0, mentionStart) + `@${user.name} ` + text.slice(pos))
    setMentionQuery(null)
    setTimeout(() => el.focus(), 0)
  }

  function applyFormat(before: string, after: string) {
    const el = textareaRef.current
    if (!el) return
    const { text: newText, cursor } = wrap(text, el.selectionStart, el.selectionEnd, before, after)
    setText(newText)
    setTimeout(() => { el.setSelectionRange(cursor[0], cursor[1]); el.focus(); resize() }, 0)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Escape') { setMentionQuery(null); return }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (mentionQuery !== null) { setMentionQuery(null); return }
      submit(); return
    }
    if (e.key === 'Enter' && e.shiftKey) { setTimeout(resize, 0); return }
    const meta = e.metaKey || e.ctrlKey
    if (meta && e.key === 'b') { e.preventDefault(); applyFormat('**', '**') }
    if (meta && e.key === 'i') { e.preventDefault(); applyFormat('_', '_') }
    if (meta && e.key === 'e') { e.preventDefault(); applyFormat('`', '`') }
  }

  function submit() {
    const trimmed = text.trim()
    if ((!trimmed && attachments.length === 0) || !targetId) return
    sendMessage(targetId, trimmed, attachments)
    setText('')
    setAttachments([])
    setShowToolbar(false)
    setTimeout(() => { if (textareaRef.current) textareaRef.current.style.height = 'auto' }, 0)
    onSend?.()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    if (!e.dataTransfer.files) return

    const files = Array.from(e.dataTransfer.files)
    const newAttachments: FileAttachment[] = files.map((file) => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
      url: URL.createObjectURL(file), // Mock URL for preview
    }))
    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const handleEmojiSelect = (emoji: string) => {
    const el = textareaRef.current
    const pos = el ? el.selectionStart : text.length
    setText((t) => t.slice(0, pos) + emoji + t.slice(pos))
    setShowEmoji(false)
    setTimeout(() => {
      el?.focus()
      el?.setSelectionRange(pos + emoji.length, pos + emoji.length)
      resize()
    }, 0)
  }

  const empty = text.trim().length === 0 && attachments.length === 0
  const showFmt = showToolbar || text.length > 0

  const FMT = [
    { Icon: Bold,          label: 'Bold (⌘B)',       fn: () => applyFormat('**', '**') },
    { Icon: Italic,        label: 'Italic (⌘I)',      fn: () => applyFormat('_', '_') },
    { Icon: Strikethrough, label: 'Strikethrough',    fn: () => applyFormat('~~', '~~') },
    { Icon: Code,          label: 'Inline code (⌘E)', fn: () => applyFormat('`', '`') },
    { Icon: Link2,         label: 'Link',             fn: () => applyFormat('[', '](url)') },
  ]

  return (
    <div className={cn('shrink-0 relative', isThread ? 'px-3 pb-3' : 'px-4 pb-4 pt-1')}>
      {/* Formatting toolbar */}
      {showFmt && (
        <div className="flex items-center gap-0.5 rounded-t-lg border-x border-t border-line px-2 py-1.5" style={{ background: '#25272b' }}>
          {FMT.map(({ Icon, label, fn }) => (
            <button key={label} title={label} onMouseDown={(e) => { e.preventDefault(); fn() }}
              className="flex h-6 w-6 items-center justify-center rounded text-dim hover:bg-hover hover:text-lo transition-colors">
              <Icon size={13} />
            </button>
          ))}
          <div className="mx-1.5 h-3.5 w-px bg-line" />
          <button title="Mention (@)" onMouseDown={(e) => { e.preventDefault(); setText((t) => t + '@'); textareaRef.current?.focus() }}
            className="flex h-6 w-6 items-center justify-center rounded text-dim hover:bg-hover hover:text-lo">
            <AtSign size={13} />
          </button>
        </div>
      )}

      {/* Input box */}
      <div
        className={cn('relative flex flex-col', showFmt ? 'rounded-b-lg' : 'rounded-lg')}
        style={{ background: '#2b2d31', border: '1px solid rgba(255,255,255,0.08)' }}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-brand bg-brand/5">
            <p className="text-sm font-medium text-brand">Drop files to attach</p>
          </div>
        )}
        {mentionQuery !== null && (
          <div className="absolute bottom-full left-0 z-50">
            <MentionDropdown query={mentionQuery} onSelect={insertMention} />
          </div>
        )}

        {/* Attachment preview strip */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3 pb-1">
            {attachments.map((file) => (
              <div key={file.id} className="group relative flex items-center gap-2 rounded border border-line bg-surface px-2 py-1.5 pr-8">
                {file.mimeType.startsWith('image/') ? (
                  <img src={file.url} alt={file.name} className="h-8 w-8 rounded object-cover" />
                ) : (
                  <FileIcon size={20} className="text-brand" />
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-hi max-w-[120px] truncate">{file.name}</span>
                  <span className="text-2xs text-dim">{formatBytes(file.size)}</span>
                </div>
                <button
                  onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== file.id))}
                  className="absolute right-1 top-1 rounded-full p-0.5 text-dim hover:bg-hover hover:text-lo transition-colors"
                >
                  <XIcon size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 px-3 py-2.5">
          <div className="relative">
             <input type="file" multiple className="hidden" id="file-upload" onChange={(e) => {
               if (e.target.files) handleDrop({ preventDefault: () => {}, dataTransfer: { files: e.target.files } } as any)
             }} />
             <label htmlFor="file-upload" title="Attach file" className="shrink-0 mb-1 flex items-center justify-center cursor-pointer text-dim hover:text-lo transition-colors">
               <Paperclip size={17} />
             </label>
          </div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowToolbar(true)}
            rows={1}
            placeholder={placeholder ?? `Message #${channel?.name ?? 'channel'}…`}
            className="flex-1 resize-none bg-transparent text-base text-hi placeholder-dim outline-none leading-relaxed min-h-[24px]"
            style={{ maxHeight: '200px' }}
          />
          <div className="relative">
            <button
              title="Emoji"
              onClick={() => setShowEmoji(!showEmoji)}
              className={cn("shrink-0 mb-1 transition-colors", showEmoji ? "text-brand" : "text-dim hover:text-lo")}
            >
              <Smile size={17} />
            </button>
            {showEmoji && (
               <div className="absolute bottom-full right-0 mb-2 z-50">
                 <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />
               </div>
            )}
          </div>
          <button onClick={submit} disabled={empty} title="Send (Enter)"
            className={cn(
              'shrink-0 mb-0.5 flex h-7 w-7 items-center justify-center rounded transition-all',
              empty ? 'text-dim cursor-not-allowed' : 'bg-brand text-white hover:bg-brand-h active:scale-95',
            )}>
            <Send size={14} />
          </button>
        </div>
      </div>
      <p className="mt-1 px-1 text-2xs text-dim">
        <kbd className="font-mono">Enter</kbd> send · <kbd className="font-mono">Shift+Enter</kbd> newline · <kbd className="font-mono">⌘B/I/E</kbd> format
      </p>
    </div>
  )
}
