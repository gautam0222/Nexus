import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown, Hash, Lock, Megaphone,
  MoreHorizontal, Plus, Volume2,
} from 'lucide-react'
import { MOCK_DM_THREADS } from '@/mockData'
import { Avatar } from '@/components/ui/Avatar'
import { Tooltip } from '@/components/ui/Tooltip'
import { useChannelStore } from '@/store/channelStore'
import type { Channel, ChannelType, Team } from '@/types'
import { cn, truncate } from '@/utils'

// ─── Channel type icon ────────────────────────────────────────────────────────
function CIcon({ type, isPrivate }: { type: ChannelType; isPrivate: boolean }) {
  const cls = 'shrink-0 text-nx-muted'
  if (isPrivate)               return <Lock      size={13} className={cls} />
  if (type === 'announcement') return <Megaphone size={13} className={cls} />
  if (type === 'voice')        return <Volume2   size={13} className={cls} />
  return <Hash size={13} className={cls} />
}

// ─── Channel item ─────────────────────────────────────────────────────────────
function ChannelItem({ channel }: { channel: Channel }) {
  const navigate  = useNavigate()
  const { activeChannelId, setActiveChannel, markChannelRead } = useChannelStore()
  const isActive  = activeChannelId === channel.id
  const hasUnread = channel.unreadCount > 0

  function go() {
    setActiveChannel(channel.id)
    markChannelRead(channel.id)
    navigate(`/chat/${channel.teamId}/${channel.id}`)
  }

  return (
    <button onClick={go} className={cn('nav-item group', isActive && 'active', hasUnread && !isActive && 'unread')}>
      <CIcon type={channel.type} isPrivate={channel.isPrivate} />

      <span className={cn('flex-1 truncate text-left', hasUnread && !isActive && 'font-medium')}>
        {channel.name}
      </span>

      {/* More — shows on hover */}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-0.5 hover:bg-nx-active">
        <MoreHorizontal size={12} className="text-nx-muted" />
      </span>

      {/* Unread badge */}
      {hasUnread && !isActive && (
        <span className={cn('unread-badge text-[10px] h-[16px] min-w-[16px]', channel.hasMention && 'mention')}>
          {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
        </span>
      )}
    </button>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
function Section({
  title,
  children,
  onAdd,
  addLabel,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  onAdd?: () => void
  addLabel?: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="flex flex-col">
      <div className="group flex items-center justify-between pr-1">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-1 py-1 pl-1 text-[11px] font-semibold uppercase tracking-widest text-nx-ghost transition-colors hover:text-nx-muted"
        >
          <ChevronDown size={11} className={cn('transition-transform duration-100', !open && '-rotate-90')} />
          {title}
        </button>
        {onAdd && (
          <Tooltip content={addLabel ?? 'Add'} side="right" delayDuration={300}>
            <button
              onClick={onAdd}
              className="rounded p-0.5 text-nx-ghost opacity-0 transition-all group-hover:opacity-100 hover:bg-nx-hover hover:text-nx-muted"
            >
              <Plus size={13} />
            </button>
          </Tooltip>
        )}
      </div>

      {open && (
        <div className="flex flex-col gap-px animate-slide-right">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Workspace / team switcher ────────────────────────────────────────────────
function WorkspaceSwitcher({ teams, activeTeamId, onSelect }: {
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
          'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors',
          'hover:bg-nx-hover',
          open && 'bg-nx-hover',
        )}
      >
        {/* Team dot */}
        <div
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
          style={{ background: active?.color ?? '#5C5CDB' }}
        >
          {active?.name.charAt(0)}
        </div>
        <div className="flex flex-1 flex-col items-start overflow-hidden leading-tight">
          <span className="truncate text-sm font-semibold text-nx-primary">{active?.name ?? 'Select team'}</span>
          <span className="text-[11px] text-nx-muted">{active?.memberCount} members</span>
        </div>
        <ChevronDown size={13} className={cn('shrink-0 text-nx-muted transition-transform duration-100', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="popup absolute left-2 right-2 top-full z-50 mt-1">
            {teams.map((t) => (
              <button
                key={t.id}
                onClick={() => { onSelect(t.id); setOpen(false) }}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors',
                  'hover:bg-nx-hover',
                  t.id === activeTeamId && 'bg-nx-accent-dim text-nx-primary',
                )}
              >
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: t.color }}
                />
                <span className="flex-1 truncate text-nx-secondary">{t.name}</span>
                {t.isPrivate && <Lock size={11} className="text-nx-muted" />}
                {t.id === activeTeamId && <span className="h-1.5 w-1.5 rounded-full bg-nx-accent" />}
              </button>
            ))}
            <div className="sep mx-2" />
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-nx-muted hover:bg-nx-hover">
              <Plus size={13} />
              Create team
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar() {
  const navigate = useNavigate()
  const {
    teams, channels, activeTeamId, activeChannelId,
    setActiveTeam, setActiveChannel,
  } = useChannelStore()

  const teamChannels   = channels.filter((c) => c.teamId === activeTeamId)
  const pinnedChannels = teamChannels.filter((c) => c.isPinned)
  const otherChannels  = teamChannels.filter((c) => !c.isPinned)

  return (
    <aside
      className="flex h-full flex-col"
      style={{
        width: 'var(--sidebar-w)',
        background: '#141416',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Workspace switcher */}
      <div className="shrink-0 sep-b">
        <WorkspaceSwitcher
          teams={teams}
          activeTeamId={activeTeamId}
          onSelect={setActiveTeam}
        />
      </div>

      {/* Scrollable list */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-2 pt-3 no-scrollbar">
        {pinnedChannels.length > 0 && (
          <Section title="Pinned">
            {pinnedChannels.map((ch) => <ChannelItem key={ch.id} channel={ch} />)}
          </Section>
        )}

        <Section title="Channels" onAdd={() => {}} addLabel="Add channel">
          {otherChannels.map((ch) => <ChannelItem key={ch.id} channel={ch} />)}
        </Section>

        <Section title="Direct Messages" onAdd={() => {}} addLabel="New message">
          {MOCK_DM_THREADS.map((thread) => {
            const other    = thread.participants[1]
            const isActive = activeChannelId === thread.id
            const hasUnread = thread.unreadCount > 0

            return (
              <button
                key={thread.id}
                onClick={() => { setActiveChannel(thread.id); navigate(`/dm/${other.id}`) }}
                className={cn('nav-item', isActive && 'active', hasUnread && !isActive && 'unread')}
              >
                <Avatar initials={other.initials} status={other.status} size="xs" />
                <span className={cn('flex-1 truncate text-left', hasUnread && !isActive && 'font-medium')}>
                  {other.name}
                </span>
                {hasUnread && !isActive && (
                  <span className="unread-badge text-[10px] h-[16px] min-w-[16px]">
                    {thread.unreadCount}
                  </span>
                )}
              </button>
            )
          })}
        </Section>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-3 py-2 sep" style={{ background: 'rgba(0,0,0,0.12)' }}>
        <p className="text-[11px] text-nx-ghost">
          {truncate(teams.find((t) => t.id === activeTeamId)?.name ?? 'Nexus', 22)} workspace
        </p>
      </div>
    </aside>
  )
}
