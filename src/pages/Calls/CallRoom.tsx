import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mic, MicOff, Video, VideoOff, PhoneOff,
  Monitor, MessageSquare, Users, MoreHorizontal,
  Maximize2, Hand, Smile, Settings, Wifi, Signal,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Tooltip } from '@/components/ui/Tooltip'
import { Badge } from '@/components/ui/Badge'
import { MOCK_USERS } from '@/mockData'
import { cn } from '@/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Participant {
  user: typeof MOCK_USERS[0]
  isMuted: boolean
  isVideoOff: boolean
  isSpeaking: boolean
  isHost: boolean
  isPinned: boolean
}

// ─── Participant tile ─────────────────────────────────────────────────────────

function ParticipantTile({
  participant,
  size = 'normal',
  onPin,
}: {
  participant: Participant
  size?: 'large' | 'normal' | 'small'
  onPin?: () => void
}) {
  const { user, isMuted, isVideoOff, isSpeaking, isHost } = participant

  return (
    <div
      className={cn(
        'group relative flex items-center justify-center overflow-hidden rounded-2xl bg-nx-graphite',
        'transition-all duration-200',
        isSpeaking && 'ring-2 ring-nx-mint ring-offset-2 ring-offset-nx-bg',
        size === 'large' && 'min-h-[300px]',
        size === 'small' && 'h-28',
      )}
    >
      {/* Video placeholder (would be a <video> element in production) */}
      {isVideoOff ? (
        <div className="flex flex-col items-center gap-3">
          <Avatar
            initials={user.initials}
            size={size === 'small' ? 'md' : 'xl'}
            status={user.status}
          />
          {size !== 'small' && (
            <p className="text-sm font-medium text-nx-muted">{user.name}</p>
          )}
        </div>
      ) : (
        // Simulated video with a gradient (real app would render <video> here)
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${getGradient(user.initials)})`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-8xl font-bold text-white">{user.initials}</span>
          </div>
        </div>
      )}

      {/* Speaking pulse */}
      {isSpeaking && !isMuted && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-nx-mint animate-pulse opacity-60 pointer-events-none" />
      )}

      {/* Bottom overlay */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between rounded-b-2xl bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-white">
            {size === 'small' ? user.name.split(' ')[0] : user.name}
          </span>
          {isHost && (
            <Badge variant="amber" className="text-2xs">Host</Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isMuted && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-nx-red">
              <MicOff size={11} className="text-white" />
            </div>
          )}
          {isSpeaking && !isMuted && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-nx-mint">
              <Signal size={11} className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Hover: pin button */}
      {onPin && (
        <button
          onClick={onPin}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/60"
        >
          <Maximize2 size={12} />
        </button>
      )}
    </div>
  )
}

function getGradient(initials: string): string {
  const pairs = [
    '#6366F1 0%, #4F46E5 100%',
    '#22D3A5 0%, #0D9488 100%',
    '#F59E0B 0%, #D97706 100%',
    '#F43F5E 0%, #BE123C 100%',
    '#8B5CF6 0%, #7C3AED 100%',
    '#06B6D4 0%, #0891B2 100%',
  ]
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % pairs.length
  return pairs[idx]
}

// ─── Control button ───────────────────────────────────────────────────────────

function ControlBtn({
  icon, activeIcon, label, active = false, danger = false, onClick,
}: {
  icon: React.ReactNode
  activeIcon?: React.ReactNode
  label: string
  active?: boolean
  danger?: boolean
  onClick: () => void
}) {
  return (
    <Tooltip content={label} side="top">
      <button
        onClick={onClick}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-150',
          'active:scale-95',
          danger
            ? 'bg-nx-red text-white hover:bg-red-600'
            : active
              ? 'bg-nx-surface3 text-white'
              : 'bg-nx-surface2 text-nx-muted hover:bg-nx-surface3 hover:text-nx-cream',
        )}
      >
        {active && activeIcon ? activeIcon : icon}
      </button>
    </Tooltip>
  )
}

// ─── Call timer ───────────────────────────────────────────────────────────────

function CallTimer() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const fmt = (n: number) => String(n).padStart(2, '0')
  return (
    <span className="font-mono text-sm text-nx-muted tabular-nums">
      {h > 0 && `${fmt(h)}:`}{fmt(m)}:{fmt(s)}
    </span>
  )
}

// ─── Main call room ───────────────────────────────────────────────────────────

export default function CallRoom() {
  const navigate = useNavigate()

  const [isMuted,       setIsMuted]       = useState(false)
  const [isVideoOff,    setIsVideoOff]    = useState(false)
  const [isScreenShare, setIsScreenShare] = useState(false)
  const [showChat,      setShowChat]      = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [handRaised,    setHandRaised]    = useState(false)
  const [pinnedId,      setPinnedId]      = useState<string | null>(null)
  const [layout,        setLayout]        = useState<'grid' | 'spotlight'>('grid')

  const participants: Participant[] = MOCK_USERS.slice(0, 4).map((user, i) => ({
    user,
    isMuted:    i === 2,
    isVideoOff: i === 3,
    isSpeaking: i === 1,
    isHost:     i === 0,
    isPinned:   user.id === pinnedId,
  }))

  const pinned = pinnedId ? participants.find((p) => p.user.id === pinnedId) : null
  const others = participants.filter((p) => p.user.id !== pinnedId)

  function endCall() {
    navigate('/calls')
  }

  return (
    <div className="flex h-full flex-col bg-nx-bg overflow-hidden">
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-shrink-0 items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-nx-indigo">
            <span className="text-xs font-bold text-white">N</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-nx-cream">Engineering · #general</p>
            <div className="flex items-center gap-2">
              <CallTimer />
              <span className="text-nx-subtle">·</span>
              <span className="text-xs text-nx-muted">{participants.length} participants</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-nx-mint/10 px-2.5 py-1">
            <Wifi size={12} className="text-nx-mint" />
            <span className="text-xs font-medium text-nx-mint">HD · 42ms</span>
          </div>
          <Tooltip content="Layout" side="bottom">
            <button
              onClick={() => setLayout((l) => l === 'grid' ? 'spotlight' : 'grid')}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-nx-muted hover:bg-nx-surface2 hover:text-nx-cream transition-colors"
            >
              <MoreHorizontal size={15} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* ── Main video area ───────────────────────────────────────────────── */}
      <div className="flex flex-1 gap-3 overflow-hidden px-4 pb-2">
        {/* Primary grid / spotlight */}
        <div className="flex flex-1 flex-col gap-3 overflow-hidden">
          {layout === 'spotlight' && pinned ? (
            // Spotlight: one large tile
            <div className="flex-1">
              <ParticipantTile participant={pinned} size="large" />
            </div>
          ) : (
            // Grid: responsive grid layout
            <div className={cn(
              'grid flex-1 gap-3',
              participants.length <= 2 ? 'grid-cols-2' :
              participants.length <= 4 ? 'grid-cols-2' :
              'grid-cols-3',
            )}>
              {participants.map((p) => (
                <ParticipantTile
                  key={p.user.id}
                  participant={p}
                  onPin={() => setPinnedId(p.user.id === pinnedId ? null : p.user.id)}
                />
              ))}
            </div>
          )}

          {/* Thumbnail strip (spotlight mode) */}
          {layout === 'spotlight' && pinned && (
            <div className="flex flex-shrink-0 gap-2 overflow-x-auto pb-1">
              {others.map((p) => (
                <div key={p.user.id} className="w-36 flex-shrink-0">
                  <ParticipantTile
                    participant={p}
                    size="small"
                    onPin={() => setPinnedId(p.user.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Side panel (chat or participants) ────────────────────────── */}
        {(showChat || showParticipants) && (
          <div className="flex w-64 flex-shrink-0 flex-col rounded-2xl border border-nx-border bg-nx-surface overflow-hidden animate-slide-right">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-nx-border px-4 py-2.5">
              <h3 className="text-sm font-semibold text-nx-cream">
                {showParticipants ? 'Participants' : 'Chat'}
              </h3>
              <button
                onClick={() => { setShowChat(false); setShowParticipants(false) }}
                className="text-xs text-nx-muted hover:text-nx-cream"
              >
                Close
              </button>
            </div>

            {/* Participants list */}
            {showParticipants && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {participants.map((p) => (
                  <div key={p.user.id} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-nx-surface2">
                    <Avatar initials={p.user.initials} status={p.user.status} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-nx-cream">{p.user.name}</p>
                      {p.isHost && <p className="text-xs text-nx-amber">Host</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      {p.isMuted && <MicOff size={12} className="text-nx-red" />}
                      {p.isVideoOff && <VideoOff size={12} className="text-nx-muted" />}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Chat panel */}
            {showChat && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {[
                    { user: MOCK_USERS[1], text: 'Can everyone see my screen?', time: '2m ago' },
                    { user: MOCK_USERS[2], text: 'Yes, looks good! 👍', time: '1m ago' },
                    { user: MOCK_USERS[0], text: 'Let\'s jump to slide 4', time: 'just now' },
                  ].map((m, i) => (
                    <div key={i} className="flex gap-2">
                      <Avatar initials={m.user.initials} size="xs" className="flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-semibold text-nx-cream">{m.user.name.split(' ')[0]}</span>
                          <span className="text-2xs text-nx-subtle">{m.time}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-nx-muted">{m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex-shrink-0 border-t border-nx-border p-2">
                  <input
                    placeholder="Message to everyone…"
                    className="w-full rounded-lg bg-nx-surface2 px-3 py-2 text-xs text-nx-cream placeholder-nx-subtle outline-none focus:ring-1 focus:ring-nx-indigo"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Control bar ──────────────────────────────────────────────────── */}
      <div className="flex flex-shrink-0 items-center justify-center gap-3 border-t border-nx-border bg-nx-graphite px-6 py-3">
        {/* Left controls */}
        <div className="flex items-center gap-2 mr-4">
          <ControlBtn
            icon={<Mic size={18} />} activeIcon={<MicOff size={18} />}
            label={isMuted ? 'Unmute' : 'Mute'} active={isMuted}
            onClick={() => setIsMuted((m) => !m)}
          />
          <ControlBtn
            icon={<Video size={18} />} activeIcon={<VideoOff size={18} />}
            label={isVideoOff ? 'Start video' : 'Stop video'} active={isVideoOff}
            onClick={() => setIsVideoOff((v) => !v)}
          />
        </div>

        {/* Center controls */}
        <div className="flex items-center gap-2">
          <ControlBtn
            icon={<Monitor size={18} />}
            label={isScreenShare ? 'Stop sharing' : 'Share screen'}
            active={isScreenShare}
            onClick={() => setIsScreenShare((s) => !s)}
          />
          <ControlBtn
            icon={<Hand size={18} />}
            label={handRaised ? 'Lower hand' : 'Raise hand'}
            active={handRaised}
            onClick={() => setHandRaised((h) => !h)}
          />
          <ControlBtn
            icon={<Smile size={18} />}
            label="Reactions"
            onClick={() => {}}
          />
          <ControlBtn
            icon={<MessageSquare size={18} />}
            label="Chat"
            active={showChat}
            onClick={() => { setShowChat((s) => !s); setShowParticipants(false) }}
          />
          <ControlBtn
            icon={<Users size={18} />}
            label="Participants"
            active={showParticipants}
            onClick={() => { setShowParticipants((s) => !s); setShowChat(false) }}
          />
          <ControlBtn
            icon={<Settings size={18} />}
            label="Settings"
            onClick={() => {}}
          />
        </div>

        {/* End call */}
        <div className="ml-4">
          <ControlBtn
            icon={<PhoneOff size={18} />}
            label="End call"
            danger
            onClick={endCall}
          />
        </div>
      </div>
    </div>
  )
}
