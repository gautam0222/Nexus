import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  ChevronRight,
  Hash,
  Lock,
  Megaphone,
  MoreHorizontal,
  Plus,
  Volume2,
} from 'lucide-react'
import { MOCK_DM_THREADS } from '@/mockData'
import { Avatar } from '@/components/ui/Avatar'
import { UnreadBadge } from '@/components/ui/Badge'
import { Tooltip } from '@/components/ui/Tooltip'
import { useChannelStore } from '@/store/channelStore'
import { useUIStore } from '@/store/uiStore'
import type { Channel, ChannelType, Team } from '@/types'
import { cn, truncate } from '@/utils'

function ChannelIcon({
  type,
  isPrivate,
}: {
  type: ChannelType
  isPrivate: boolean
}) {
  if (isPrivate) return <Lock size={14} className="shrink-0 opacity-60" />
  if (type === 'announcement') {
    return <Megaphone size={14} className="shrink-0 opacity-60" />
  }
  if (type === 'voice') return <Volume2 size={14} className="shrink-0 opacity-60" />
  return <Hash size={14} className="shrink-0 opacity-60" />
}

function ChannelItem({ channel }: { channel: Channel }) {
  const navigate = useNavigate()
  const { activeChannelId, setActiveChannel, markChannelRead } = useChannelStore()
  const isActive = activeChannelId === channel.id
  const hasActivity = channel.unreadCount > 0

  function handleClick() {
    setActiveChannel(channel.id)
    markChannelRead(channel.id)
    navigate(`/chat/${channel.teamId}/${channel.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'sidebar-item group w-full',
        isActive && 'active',
        hasActivity && !isActive && 'text-nx-cream',
      )}
    >
      <ChannelIcon type={channel.type} isPrivate={channel.isPrivate} />

      <span
        className={cn(
          'flex-1 truncate text-left text-sm',
          hasActivity && 'font-medium',
        )}
      >
        {channel.name}
      </span>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Tooltip content="More options" side="top">
          <span className="rounded p-0.5 hover:bg-nx-surface3">
            <MoreHorizontal size={12} />
          </span>
        </Tooltip>
      </div>

      {channel.unreadCount > 0 && !isActive && (
        <UnreadBadge count={channel.unreadCount} mention={channel.hasMention} />
      )}
    </button>
  )
}

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
    <div>
      <div className="group flex items-center justify-between px-2 py-1">
        <button
          onClick={() => setOpen((value) => !value)}
          className="flex flex-1 items-center gap-1 text-xs font-semibold uppercase tracking-widest text-nx-subtle transition-colors hover:text-nx-muted"
        >
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {title}
        </button>
        {onAdd && (
          <Tooltip content={addLabel} side="top">
            <button
              onClick={onAdd}
              className="rounded p-0.5 text-nx-subtle opacity-0 transition-all hover:bg-nx-surface2 hover:text-nx-muted group-hover:opacity-100"
              aria-label={addLabel}
            >
              <Plus size={14} />
            </button>
          </Tooltip>
        )}
      </div>

      {open && <div className="animate-slide-right">{children}</div>}
    </div>
  )
}

function TeamSwitcher({
  teams,
  activeTeamId,
  onSelect,
}: {
  teams: Team[]
  activeTeamId: string | null
  onSelect: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const activeTeam = teams.find((team) => team.id === activeTeamId)

  return (
    <div className="relative px-2 pb-2">
      <button
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2',
          'transition-colors hover:bg-nx-surface2',
          open && 'bg-nx-surface2',
        )}
      >
        <div
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
          style={{ backgroundColor: activeTeam?.color ?? '#6366F1' }}
        >
          {activeTeam?.name.charAt(0)}
        </div>

        <div className="flex flex-1 flex-col items-start overflow-hidden">
          <span className="truncate text-sm font-semibold text-nx-cream">
            {activeTeam?.name ?? 'Select team'}
          </span>
          <span className="text-xs text-nx-muted">
            {activeTeam?.memberCount} members
          </span>
        </div>

        <ChevronDown
          size={14}
          className={cn('text-nx-muted transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute top-full right-2 left-2 z-50 mt-1 overflow-hidden rounded-xl border border-nx-border bg-nx-surface shadow-glow-md">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                onSelect(team.id)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2.5 px-3 py-2 text-left',
                'transition-colors hover:bg-nx-surface2',
                team.id === activeTeamId && 'bg-nx-indigo-muted',
              )}
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                style={{ backgroundColor: team.color }}
              >
                {team.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-nx-cream">{team.name}</p>
                <p className="text-xs text-nx-muted">{team.memberCount} members</p>
              </div>
              {team.isPrivate && <Lock size={11} className="ml-auto text-nx-subtle" />}
            </button>
          ))}

          <div className="border-t border-nx-border">
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-nx-muted hover:bg-nx-surface2">
              <Plus size={14} />
              Create team
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const { teams, channels, activeTeamId, activeChannelId, setActiveTeam, setActiveChannel } =
    useChannelStore()
  const { sidebarCollapsed } = useUIStore()
  const navigate = useNavigate()

  const teamChannels = channels.filter((channel) => channel.teamId === activeTeamId)
  const pinnedChannels = teamChannels.filter((channel) => channel.isPinned)
  const regularChannels = teamChannels.filter((channel) => !channel.isPinned)

  if (sidebarCollapsed) return null

  return (
    <aside
      className={cn(
        'flex h-full w-sidebar flex-col border-r border-nx-border bg-nx-graphite',
        'animate-slide-right overflow-hidden',
      )}
    >
      <div className="shrink-0 border-b border-nx-border pt-2">
        <TeamSwitcher
          teams={teams}
          activeTeamId={activeTeamId}
          onSelect={setActiveTeam}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-2 py-3">
        {pinnedChannels.length > 0 && (
          <SidebarSection title="Pinned" defaultOpen={true}>
            {pinnedChannels.map((channel) => (
              <ChannelItem key={channel.id} channel={channel} />
            ))}
          </SidebarSection>
        )}

        <SidebarSection
          title="Channels"
          onAdd={() => console.log('add channel')}
          addLabel="Add channel"
        >
          {regularChannels.map((channel) => (
            <ChannelItem key={channel.id} channel={channel} />
          ))}
        </SidebarSection>

        <SidebarSection
          title="Direct Messages"
          onAdd={() => console.log('new DM')}
          addLabel="New message"
        >
          {MOCK_DM_THREADS.map((thread) => {
            const other = thread.participants[1]
            const isActive = activeChannelId === thread.id

            return (
              <button
                key={thread.id}
                onClick={() => {
                  setActiveChannel(thread.id)
                  navigate(`/dm/${other.id}`)
                }}
                className={cn('sidebar-item group w-full', isActive && 'active')}
              >
                <Avatar
                  initials={other.initials}
                  status={other.status}
                  size="xs"
                />
                <span
                  className={cn(
                    'flex-1 truncate text-left text-sm',
                    thread.unreadCount > 0 && 'font-medium text-nx-cream',
                  )}
                >
                  {other.name}
                </span>
                {thread.unreadCount > 0 && !isActive && (
                  <UnreadBadge count={thread.unreadCount} />
                )}
              </button>
            )
          })}
        </SidebarSection>
      </div>

      <div className="shrink-0 border-t border-nx-border px-3 py-2">
        <p className="text-xs text-nx-subtle">
          {truncate(
            teams.find((team) => team.id === activeTeamId)?.name ?? 'Nexus',
            20,
          )}{' '}
          workspace
        </p>
      </div>
    </aside>
  )
}
