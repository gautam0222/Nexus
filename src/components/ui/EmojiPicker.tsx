import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/utils'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

const CATEGORIES = [
  { id: 'recent',   label: '🕐', title: 'Recently used' },
  { id: 'smileys',  label: '😀', title: 'Smileys & People' },
  { id: 'gestures', label: '👋', title: 'Gestures' },
  { id: 'nature',   label: '🐶', title: 'Animals & Nature' },
  { id: 'food',     label: '🍎', title: 'Food & Drink' },
  { id: 'travel',   label: '✈️', title: 'Travel & Places' },
  { id: 'objects',  label: '💡', title: 'Objects' },
  { id: 'symbols',  label: '❤️', title: 'Symbols' },
]

const EMOJI_DATA: Record<string, string[]> = {
  recent:   ['👍', '❤️', '😂', '🔥', '✅', '🚀', '👀', '🎉'],
  smileys:  [
    '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊',
    '😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜',
    '🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶',
    '😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒',
  ],
  gestures: [
    '👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘',
    '🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛',
    '🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💪','🦾','🦿','🦵',
  ],
  nature:   [
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮',
    '🐷','🐸','🐵','🐔','🐧','🐦','🦆','🦅','🦉','🦇','🐺','🐗',
    '🌸','🌺','🌻','🌹','🌷','🍀','🌿','🍃','🌱','🌴','🌳','🌲',
  ],
  food:     [
    '🍎','🍊','🍋','🍇','🍓','🍒','🍑','🥭','🍍','🥥','🥝','🍅',
    '🌽','🥕','🧅','🥔','🍠','🥐','🥖','🫓','🥨','🧀','🥚','🍳',
    '🧇','🥞','🧈','🍔','🍟','🌭','🥪','🌮','🌯','🫔','🥙','🧆',
  ],
  travel:   [
    '🚀','✈️','🛸','🚁','🛺','🚂','🚢','🏖️','🏔️','🗻','🌋','🏕️',
    '🗼','🗽','🏰','🏯','⛩️','🕌','🕍','🛕','🗺️','🧭','🌍','🌎',
  ],
  objects:  [
    '💡','🔦','🕯️','💰','💳','💎','⚙️','🔧','🪛','🔨','⚒️','🛠️',
    '🔑','🗝️','🔒','🔓','🚪','📱','💻','⌨️','🖥️','🖨️','📷','📸',
    '📚','📖','📝','✏️','🖊️','📌','📍','🗂️','📁','📂','🗃️','📋',
  ],
  symbols:  [
    '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️🔥','❣️',
    '💕','💞','💓','💗','💖','💘','💝','✅','❌','❓','❗','⭐',
    '🌟','💫','✨','🔥','💥','🎉','🎊','🏆','🥇','🎯','🎪','🎭',
  ],
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🚀']

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [search, setSearch]     = useState('')
  const [activeCategory, setActiveCategory] = useState('recent')
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const filtered = search.trim()
    ? Object.values(EMOJI_DATA).flat().filter((e) => e.includes(search))
    : EMOJI_DATA[activeCategory] ?? []

  return (
    <div
      ref={ref}
      className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-xl w-72 animate-fade-in"
      style={{ maxHeight: '340px' }}
    >
      {/* Search */}
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <Search size={13} className="shrink-0 text-dim" />
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emoji…"
          className="flex-1 bg-transparent text-sm text-hi placeholder-dim outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-dim hover:text-lo">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="flex shrink-0 gap-0.5 border-b border-line px-2 py-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              title={cat.title}
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded text-base transition-colors',
                activeCategory === cat.id
                  ? 'bg-brand/20 text-brand'
                  : 'hover:bg-hover'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Category title */}
      {!search && (
        <div className="px-3 pb-0.5 pt-2">
          <span className="text-2xs font-semibold uppercase tracking-widest text-dim">
            {CATEGORIES.find((c) => c.id === activeCategory)?.title}
          </span>
        </div>
      )}

      {/* Emoji grid */}
      <div className="grid grid-cols-8 gap-0.5 overflow-y-auto p-2">
        {filtered.map((emoji, i) => (
          <button
            key={i}
            onClick={() => onSelect(emoji)}
            className="flex h-8 w-8 items-center justify-center rounded text-lg transition-all hover:scale-110 hover:bg-hover"
          >
            {emoji}
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-8 py-6 text-center text-xs text-dim">
            No emoji found for "{search}"
          </div>
        )}
      </div>

      {/* Quick reactions strip */}
      <div className="flex shrink-0 items-center gap-1 border-t border-line px-3 py-2 bg-app">
        <span className="mr-1 text-2xs text-dim">Quick:</span>
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="text-base transition-transform hover:scale-125"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
