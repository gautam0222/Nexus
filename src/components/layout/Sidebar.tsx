import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Bell, MessageSquare, Users, Calendar, FolderOpen, Video,
  Settings, Hash, Lock, ChevronDown, ChevronRight, Plus, Search,
} from 'lucide-react'
import { useChannelStore } from '@/store/channelStore'
import { useUIStore } from '@/store'
import { useAuthStore } from '@/store/authStore'
import { MOCK_DM_THREADS } from '@/mockData'
import { cn } from '@/utils'
import type { Channel } from '@/types'

// ─── Nav links ────────────────────────────────────────────────

const NAV = [
  { label: 'Activity',   icon: Bell,         path: '/activity' },
  { label: 'Chat',       icon: MessageSquare, path: '/chat' },
  { label: 'Teams',      icon: Users,         path: '/teams' },
  { label: 'Calendar',   icon: Calendar,      path: '/calendar' },
  { label: 'Files',      icon: FolderOpen,    path: '/files' },
  { label: 'Calls',      icon: Video,         path: '/calls' },
]

// ─── Collapsible section ──────────────────────────────────────

function Section({ title, onAdd, children }: {
  title: string
  onAdd?: () => void
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className="mt-4">
      <div className="group flex items-center justify-between px-2 mb-0.5">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-dim hover:text-lo"
        >
          {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          {title}
        </button>
        {onAdd && (
          <button
            onClick={onAdd}
            className="opacity-0 group-hover:opacity-100 text-dim hover:text-lo transition-opacity"
          >
            <Plus size={14} />
          </button>
        )}
      </div>
      {open && <div>{children}</div>}
    </div>
  )
}

// ─── Channel row ──────────────────────────────────────────────

function ChannelRow({ channel }: { channel: Channel }) {
  const navigate = useNavigate()
  const { activeChannelId, setActiveChannel, markChannelRead } = useChannelStore()
  const isActive = activeChannelId === channel.id

  function go() {
    setActiveChannel(channel.id)
    markChannelRead(channel.id)
    navigate(`/chat/${channel.teamId}/${channel.id}`)
  }

  return (
    <button
      onClick={go}
      className={cn(
        'ch-item',
        isActive && 'active',
        channel.unreadCount > 0 && !isActive && 'unread',
      )}
    >
      {channel.isPrivate
        ? <Lock size={13} className="shrink-0 opacity-50" />
        : <Hash size={13} className="shrink-0 opacity-50" />
      }
      <span className="flex-1 truncate">{channel.name}</span>
      {channel.unreadCount > 0 && !isActive && (
        <span className={cn(
          'flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white',
          channel.hasMention ? 'bg-danger' : 'bg-brand',
        )}>
          {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
        </span>
      )}
    </button>
  )
}

// ─── Main sidebar ─────────────────────────────────────────────

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { teams, channels, activeTeamId } = useChannelStore()
  const { openSearch } = useUIStore()
  const { user } = useAuthStore()

  const activeTeam = teams.find((t) => t.id === activeTeamId)
  const teamChannels = channels.filter((ch) => ch.teamId === activeTeamId)

  return (
    <aside
      className="flex h-full flex-col border-r"
      style={{ width: 'var(--sidebar-w)', background: '#19171d', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      {/* Workspace header */}
      <div className="flex items-center justify-between border-b px-3 py-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ background: '#5865f2' }}
          >
            N
          </div>
          <span className="text-sm font-semibold text-hi truncate">
            {activeTeam?.name ?? 'Nexus'}
          </span>
        </div>
        <button
          onClick={openSearch}
          className="text-dim hover:text-lo transition-colors"
          title="Search (⌘K)"
        >
          <Search size={15} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="px-2 pt-2">
        {NAV.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/')
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'ch-item mb-0.5',
                isActive && 'active',
              )}
            >
              <Icon size={15} className="shrink-0" />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 mt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <Section title="Channels" onAdd={() => {}}>
          {teamChannels.map((ch) => <ChannelRow key={ch.id} channel={ch} />)}
        </Section>

        <Section title="Direct Messages" onAdd={() => {}}>
          {MOCK_DM_THREADS.map((thread) => {
            const other = thread.participants[1]
            return (
              <button
                key={thread.id}
                onClick={() => navigate(`/dm/${other.id}`)}
                className="ch-item"
              >
                <div className="relative shrink-0">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-2xs font-semibold text-hi">
                    {other.initials}
                  </div>
                  <span className={cn(
                    'absolute -bottom-px -right-px h-2 w-2 rounded-full ring-1 ring-sidebar',
                    other.status === 'online' ? 'bg-online' :
                    other.status === 'busy' ? 'bg-busy' :
                    other.status === 'away' ? 'bg-away' : 'bg-offline',
                  )} />
                </div>
                <span className="flex-1 truncate">{other.name}</span>
                {thread.unreadCount > 0 && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                    {thread.unreadCount}
                  </span>
                )}
              </button>
            )
          })}
        </Section>
      </div>

      {/* User footer */}
      {user && (
        <div
          className="flex items-center gap-2 border-t px-3 py-2.5"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="relative shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-xs font-semibold text-hi">
              {user.initials}
            </div>
            <span className="absolute -bottom-px -right-px h-2.5 w-2.5 rounded-full bg-online ring-1 ring-sidebar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-hi truncate">{user.name}</p>
            <p className="text-2xs text-dim truncate">{user.title ?? user.email}</p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="text-dim hover:text-lo transition-colors shrink-0"
          >
            <Settings size={14} />
          </button>
        </div>
      )}
    </aside>
  )
}