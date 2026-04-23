import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown, Hash, Lock,
  Megaphone, MoreHorizontal, Plus, Volume2,
} from 'lucide-react'
import { MOCK_DM_THREADS } from '@/mockData'
import { Avatar } from '@/components/ui/Avatar'
import { UnreadBadge } from '@/components/ui/Badge'
import { Tooltip } from '@/components/ui/Tooltip'
import { useChannelStore } from '@/store/channelStore'
import { useUIStore } from '@/store/uiStore'
import type { Channel, ChannelType, Team } from '@/types'
import { cn, truncate } from '@/utils'

// ─── Channel type icon ────────────────────────────────────────────────────────
function ChannelIcon({ type, isPrivate }: { type: ChannelType; isPrivate: boolean }) {
  const cls = 'shrink-0 text-nx-muted'
  if (isPrivate)              return <Lock     size={12} className={cls} />
  if (type === 'announcement') return <Megaphone size={12} className={cls} />
  if (type === 'voice')        return <Volume2  size={12} className={cls} />
  return <Hash size={12} className={cls} />
}

// ─── Channel list item ────────────────────────────────────────────────────────
function ChannelItem({ channel }: { channel: Channel }) {
  const navigate = useNavigate()
  const { activeChannelId, setActiveChannel, markChannelRead } = useChannelStore()
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
      className={cn(
        'ch-item group',
        isActive  && 'active',
        hasUnread && !isActive && 'unread',
      )}
    >
      <ChannelIcon type={channel.type} isPrivate={channel.isPrivate} />

      <span className={cn(
        'flex-1 truncate text-left text-sm leading-none',
        hasUnread && !isActive && 'font-semibold',
      )}>
        {channel.name}
      </span>

      {/* Hover: more options */}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-0.5 hover:bg-nx-overlay">
        <MoreHorizontal size={11} className="text-nx-muted" />
      </span>

      {/* Unread badge */}
      {hasUnread && !isActive && (
        <UnreadBadge count={channel.unreadCount} mention={channel.hasMention} />
      )}
    </button>
  )
}

// ─── Collapsible section ──────────────────────────────────────────────────────
function SidebarSection({
  title,
  children,
  onAdd,
  addLabel = 'Add',
  defaultOpen = true,
}: {
  title: string
  children: ReactNode
  onAdd?: () => void
  addLabel?: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="flex flex-col gap-px">
      {/* Section header */}
      <div className="group flex items-center justify-between px-1 pt-4 pb-1">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-nx-ghost transition-colors hover:text-nx-muted"
        >
          <ChevronDown
            size={10}
            className={cn('transition-transform duration-150', !open && '-rotate-90')}
          />
          {title}
        </button>
        {onAdd && (
          <Tooltip content={addLabel} side="top" delayDuration={400}>
            <button
              onClick={onAdd}
              aria-label={addLabel}
              className="rounded-md p-0.5 text-nx-ghost opacity-0 transition-all group-hover:opacity-100 hover:bg-nx-overlay hover:text-nx-muted"
            >
              <Plus size={12} />
            </button>
          </Tooltip>
        )}
      </div>

      {open && (
        <div className="animate-slide-right flex flex-col gap-px">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Team / workspace switcher ────────────────────────────────────────────────
function WorkspaceHeader({
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
    <div className="relative px-2 pb-2 pt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5',
          'transition-colors hover:bg-nx-overlay',
          open && 'bg-nx-overlay',
        )}
      >
        {/* Team avatar dot */}
        <div
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-bold text-white shadow-glow-sm"
          style={{ background: active?.color ?? '#8B5CF6' }}
        >
          {active?.name.charAt(0)}
        </div>

        <div className="flex flex-1 flex-col items-start overflow-hidden leading-none">
          <span className="truncate text-sm font-semibold text-nx-primary">
            {active?.name ?? 'Select team'}
          </span>
          <span className="mt-0.5 text-[10px] text-nx-muted">
            {active?.memberCount} members
          </span>
        </div>

        <ChevronDown
          size={12}
          className={cn('text-nx-ghost transition-transform duration-150', open && 'rotate-180')}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Clickaway */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute left-2 right-2 top-full z-50 mt-1 overflow-hidden rounded-xl animate-scale-in"
            style={{
              background: '#1D1D32',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 20px 48px rgba(0,0,0,0.75)',
            }}
          >
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => { onSelect(team.id); setOpen(false) }}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors',
                  'hover:bg-nx-overlay',
                  team.id === activeTeamId && 'bg-nx-violet-dim',
                )}
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[9px] font-bold text-white"
                  style={{ background: team.color }}
                />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-nx-primary">{team.name}</p>
                  <p className="text-[10px] text-nx-muted">{team.memberCount} members</p>
                </div>
                {team.isPrivate && <Lock size={10} className="ml-auto text-nx-ghost" />}
                {team.id === activeTeamId && (
                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-nx-violet" />
                )}
              </button>
            ))}
            <div className="sep-top mx-3" />
            <button className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-nx-muted hover:bg-nx-overlay">
              <Plus size={12} />
              <span>Create team</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── DM item ──────────────────────────────────────────────────────────────────
function DMItem({
  thread,
  isActive,
  onClick,
}: {
  thread: (typeof MOCK_DM_THREADS)[number]
  isActive: boolean
  onClick: () => void
}) {
  const other     = thread.participants[1]
  const hasUnread = thread.unreadCount > 0

  return (
    <button
      onClick={onClick}
      className={cn(
        'ch-item',
        isActive  && 'active',
        hasUnread && !isActive && 'unread',
      )}
    >
      <Avatar initials={other.initials} status={other.status} size="xs" />
      <span className={cn(
        'flex-1 truncate text-left text-sm',
        hasUnread && !isActive && 'font-semibold',
      )}>
        {other.name}
      </span>
      {hasUnread && !isActive && <UnreadBadge count={thread.unreadCount} />}
    </button>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar() {
  const {
    teams, channels, activeTeamId, activeChannelId,
    setActiveTeam, setActiveChannel,
  } = useChannelStore()
  const { sidebarCollapsed } = useUIStore()
  const navigate = useNavigate()

  if (sidebarCollapsed) return null

  const teamChannels   = channels.filter((c) => c.teamId === activeTeamId)
  const pinnedChannels = teamChannels.filter((c) => c.isPinned)
  const otherChannels  = teamChannels.filter((c) => !c.isPinned)

  return (
    <aside
      className="flex h-full flex-col overflow-hidden animate-slide-right"
      style={{
        width: 'var(--sidebar-w)',
        background: '#0E0E1B',
        borderRight: '1px solid rgba(255,255,255,0.045)',
      }}
    >
      {/* Workspace header */}
      <div className="sep-bottom shrink-0">
        <WorkspaceHeader
          teams={teams}
          activeTeamId={activeTeamId}
          onSelect={setActiveTeam}
        />
      </div>

      {/* Scrollable channel list */}
      <div className="flex flex-1 flex-col overflow-y-auto px-2 pb-4 no-scrollbar">

        {pinnedChannels.length > 0 && (
          <SidebarSection title="Pinned">
            {pinnedChannels.map((ch) => <ChannelItem key={ch.id} channel={ch} />)}
          </SidebarSection>
        )}

        <SidebarSection
          title="Channels"
          onAdd={() => console.log('add channel')}
          addLabel="Add channel"
        >
          {otherChannels.map((ch) => <ChannelItem key={ch.id} channel={ch} />)}
        </SidebarSection>

        <SidebarSection
          title="Direct Messages"
          onAdd={() => console.log('new dm')}
          addLabel="New message"
        >
          {MOCK_DM_THREADS.map((thread) => (
            <DMItem
              key={thread.id}
              thread={thread}
              isActive={activeChannelId === thread.id}
              onClick={() => {
                setActiveChannel(thread.id)
                navigate(`/dm/${thread.participants[1].id}`)
              }}
            />
          ))}
        </SidebarSection>
      </div>

      {/* Footer */}
      <div
        className="shrink-0 px-3 py-2 sep-top"
        style={{ background: 'rgba(0,0,0,0.15)' }}
      >
        <p className="text-[10px] tracking-wide text-nx-ghost">
          {truncate(teams.find((t) => t.id === activeTeamId)?.name ?? 'Nexus', 22)} workspace
        </p>
      </div>
    </aside>
  )
}
