import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Hash, Lock, Megaphone, Plus, Volume2, PanelLeftClose } from 'lucide-react'
import { MOCK_DM_THREADS } from '@/mockData'
import { Tooltip } from '@/components/ui/Tooltip'
import { useChannelStore } from '@/store/channelStore'
import type { Channel, ChannelType, Team } from '@/types'
import { cn, truncate } from '@/utils'

// ─── User neon colors (deterministic per user) ───────────────────────────────
const USER_COLORS: Record<string, string> = {
  u1: '#FF0055', u2: '#00EEFF', u3: '#BBFF00',
  u4: '#9D00FF', u5: '#FF8800', u6: '#00FFB2',
}
function getUserColor(userId: string) {
  return USER_COLORS[userId] ?? '#00EEFF'
}

// ─── Channel type icon ────────────────────────────────────────────────────────
function ChIcon({ type, isPrivate }: { type: ChannelType; isPrivate: boolean }) {
  const cls = 'shrink-0 text-nx-dim'
  if (isPrivate)              return <Lock      size={10} className={cls} />
  if (type === 'announcement') return <Megaphone size={10} className={cls} />
  if (type === 'voice')        return <Volume2   size={10} className={cls} />
  return <Hash size={10} className={cls} />
}

// ─── Cursor prefix span ───────────────────────────────────────────────────────
function Cursor({ active, hovered }: { active: boolean; hovered: boolean }) {
  const char = active ? '»' : hovered ? '>' : ' '
  const color = (active || hovered) ? '#00EEFF' : 'transparent'
  return (
    <span
      className="w-3 shrink-0 font-mono text-[10px] transition-all duration-100"
      style={{ color, textShadow: (active || hovered) ? '0 0 8px rgba(0,238,255,0.80)' : 'none' }}
    >
      {char}
    </span>
  )
}

// ─── Terminal channel item ────────────────────────────────────────────────────
function ChannelItem({ channel }: { channel: Channel }) {
  const navigate = useNavigate()
  const { activeChannelId, setActiveChannel, markChannelRead } = useChannelStore()
  const [hovered, setHovered] = useState(false)

  const isActive  = activeChannelId === channel.id
  const hasUnread = channel.unreadCount > 0

  function handleClick() {
    setActiveChannel(channel.id)
    markChannelRead(channel.id)
    navigate(`/chat/${channel.teamId}/${channel.id}`)
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn('ch-item', isActive && 'active', hasUnread && !isActive && 'unread')}
    >
      <Cursor active={isActive} hovered={hovered} />
      <ChIcon type={channel.type} isPrivate={channel.isPrivate} />

      <span className={cn('flex-1 truncate text-left', hasUnread && !isActive && 'font-semibold')}>
        {channel.name}
      </span>

      {/* Neon heat bar instead of badge */}
      {hasUnread && !isActive && (
        <div className="flex items-center gap-1.5 shrink-0">
          <div
            className="h-[3px] rounded-full"
            style={{
              width: `${Math.min(channel.unreadCount * 5, 28)}px`,
              background: channel.hasMention ? '#FF0055' : '#00EEFF',
              boxShadow: channel.hasMention
                ? '0 0 6px rgba(255,0,85,0.70)'
                : '0 0 6px rgba(0,238,255,0.70)',
            }}
          />
          <span
            className="font-mono text-[9px]"
            style={{ color: channel.hasMention ? '#FF0055' : '#00EEFF' }}
          >
            {channel.unreadCount}
          </span>
        </div>
      )}
    </button>
  )
}

// ─── DM Item ──────────────────────────────────────────────────────────────────
function DMItem({ thread }: { thread: (typeof MOCK_DM_THREADS)[number] }) {
  const navigate = useNavigate()
  const { activeChannelId, setActiveChannel } = useChannelStore()
  const [hovered, setHovered] = useState(false)

  const other     = thread.participants[1]
  const isActive  = activeChannelId === thread.id
  const hasUnread = thread.unreadCount > 0
  const color     = getUserColor(other.id)

  return (
    <button
      onClick={() => { setActiveChannel(thread.id); navigate(`/dm/${other.id}`) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn('ch-item', isActive && 'active', hasUnread && !isActive && 'unread')}
    >
      <Cursor active={isActive} hovered={hovered} />
      {/* Status dot with neon color */}
      <span
        className="h-[6px] w-[6px] shrink-0 rounded-full"
        style={{
          background: other.status === 'online' ? '#00EEFF' : other.status === 'busy' ? '#FF0055' : '#44446A',
          boxShadow: other.status === 'online' ? '0 0 6px rgba(0,238,255,0.70)' : 'none',
        }}
      />
      <span className={cn('flex-1 truncate text-left', hasUnread && !isActive && 'font-semibold')}>
        {other.name}
      </span>
      {hasUnread && !isActive && (
        <span
          className="font-mono text-[9px]"
          style={{ color, textShadow: `0 0 6px ${color}` }}
        >
          {thread.unreadCount}
        </span>
      )}
    </button>
  )
}

// ─── Team switcher ────────────────────────────────────────────────────────────
function TeamDropdown({
  teams,
  activeTeamId,
  onSelect,
}: {
  teams: Team[]
  activeTeamId: string | null
  onSelect: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const active = teams.find((t) => t.id === activeTeamId)

  return (
    <div className="relative px-2 pt-2 pb-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="holo-chip flex w-full items-center gap-2.5 rounded-xl px-3 py-2 transition-all"
      >
        {/* Team name */}
        <div className="flex flex-1 flex-col items-start overflow-hidden">
          <span className="font-mono text-[9px] tracking-widest text-nx-dim">NEXUS</span>
          <span
            className="truncate font-mono text-xs font-bold text-white"
            style={{ textShadow: '0 0 10px rgba(0,238,255,0.40)' }}
          >
            {active?.name.toUpperCase() ?? 'SELECT TEAM'}
          </span>
        </div>
        <span
          className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px]"
          style={{ background: 'rgba(0,238,255,0.10)', border: '1px solid rgba(0,238,255,0.20)', color: '#00EEFF' }}
        >
          {active?.memberCount}m
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute left-2 right-2 top-full z-50 mt-1 overflow-hidden rounded-xl animate-scale-in"
            style={{
              background: '#0D0D25',
              boxShadow: '0 0 0 1px rgba(0,238,255,0.15), 0 20px 48px rgba(0,0,0,0.90)',
            }}
          >
            {/* Top accent bar */}
            <div
              className="h-[1px]"
              style={{ background: 'linear-gradient(90deg, #FF0055, #9D00FF, #00EEFF)' }}
            />
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => { onSelect(team.id); setOpen(false) }}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-nx-overlay',
                  team.id === activeTeamId && 'bg-nx-cyan-dim',
                )}
              >
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: team.color, boxShadow: `0 0 8px ${team.color}80` }}
                />
                <span className="flex-1 truncate font-mono text-xs text-white">{team.name.toUpperCase()}</span>
                {team.isPrivate && <Lock size={9} className="text-nx-dim" />}
                {team.id === activeTeamId && (
                  <span className="neon-cyan font-mono text-[9px]">ACTIVE</span>
                )}
              </button>
            ))}
            <div className="h-[1px]" style={{ background: 'rgba(0,238,255,0.06)' }} />
            <button className="flex w-full items-center gap-2 px-3 py-2 font-mono text-[10px] text-nx-dim hover:bg-nx-overlay hover:text-nx-fog">
              <Plus size={10} />
              CREATE TEAM
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Section label ────────────────────────────────────────────────────────────
function SepLabel({ text }: { text: string }) {
  return (
    <div className="sep-label flex items-center gap-2">
      <span style={{ color: 'rgba(0,238,255,0.15)' }}>───</span>
      <span>{text}</span>
      <span style={{ color: 'rgba(0,238,255,0.15)' }}>─────────────────</span>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar({
  onToggle,
}: {
  onToggle: () => void
  collapsed?: boolean
}) {
  const {
    teams, channels, activeTeamId,
    setActiveTeam,
  } = useChannelStore()

  const teamChannels   = channels.filter((c) => c.teamId === activeTeamId)
  const pinnedChannels = teamChannels.filter((c) => c.isPinned)
  const otherChannels  = teamChannels.filter((c) => !c.isPinned)

  return (
    <aside
      className="flex h-full flex-col"
      style={{
        width: 'var(--sidebar-w)',
        background: '#07071A',
        borderRight: '1px solid rgba(0,238,255,0.06)',
      }}
    >
      {/* Top accent line */}
      <div
        className="h-[1px] w-full shrink-0"
        style={{ background: 'linear-gradient(90deg, #FF0055, #9D00FF, #00EEFF, transparent)' }}
      />

      {/* Workspace/team header */}
      <div className="shrink-0 sep-bottom">
        <TeamDropdown
          teams={teams}
          activeTeamId={activeTeamId}
          onSelect={setActiveTeam}
        />
      </div>

      {/* Channel + DM list */}
      <div className="flex flex-1 flex-col overflow-y-auto pb-2 no-scrollbar">

        {pinnedChannels.length > 0 && (
          <>
            <SepLabel text="PINNED" />
            {pinnedChannels.map((ch) => <ChannelItem key={ch.id} channel={ch} />)}
          </>
        )}

        <SepLabel text="CHANNELS" />
        {otherChannels.map((ch) => <ChannelItem key={ch.id} channel={ch} />)}

        {/* Add channel */}
        <Tooltip content="Add channel" side="right" delayDuration={400}>
          <button className="ch-item text-nx-ghost hover:text-nx-dim mt-0.5">
            <span className="w-3 shrink-0" />
            <Plus size={10} />
            <span>add channel</span>
          </button>
        </Tooltip>

        <SepLabel text="DIRECT" />
        {MOCK_DM_THREADS.map((thread) => (
          <DMItem key={thread.id} thread={thread} />
        ))}

        {/* New DM */}
        <Tooltip content="New DM" side="right" delayDuration={400}>
          <button className="ch-item text-nx-ghost hover:text-nx-dim mt-0.5">
            <span className="w-3 shrink-0" />
            <Plus size={10} />
            <span>new message</span>
          </button>
        </Tooltip>
      </div>

      {/* Footer */}
      <div
        className="shrink-0 flex items-center justify-between px-3 py-2 sep-top"
        style={{ background: 'rgba(0,0,0,0.20)' }}
      >
        <span className="font-mono text-[9px] text-nx-ghost">
          SYS // {truncate(teams.find((t) => t.id === activeTeamId)?.name ?? 'NEXUS', 12).toUpperCase()}
        </span>
        {/* Collapse button */}
        <Tooltip content="Collapse (⌘\\)" side="right" delayDuration={400}>
          <button
            onClick={onToggle}
            className="rounded p-0.5 text-nx-ghost hover:text-nx-dim transition-colors"
          >
            <PanelLeftClose size={12} />
          </button>
        </Tooltip>
      </div>
    </aside>
  )
}
