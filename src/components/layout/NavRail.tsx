import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, CalendarDays, FolderOpen,
  MessageSquare, Search, Settings, Users, Video,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Tooltip } from '@/components/ui/Tooltip'
import { ROUTES } from '@/constants'
import { useAuthStore } from '@/store/authStore'
import { useChannelStore } from '@/store/channelStore'
import { useUIStore } from '@/store/uiStore'
import type { NavSection } from '@/types'
import { cn } from '@/utils'

interface NavItem {
  id: NavSection
  label: string
  icon: ReactNode
  route: string
}

const NAV: NavItem[] = [
  { id: 'activity', label: 'Activity',  icon: <Bell          size={18} />, route: ROUTES.ACTIVITY },
  { id: 'chat',     label: 'Chat',      icon: <MessageSquare size={18} />, route: ROUTES.CHAT     },
  { id: 'teams',    label: 'Teams',     icon: <Users         size={18} />, route: ROUTES.TEAMS    },
  { id: 'calendar', label: 'Calendar',  icon: <CalendarDays  size={18} />, route: ROUTES.CALENDAR },
  { id: 'files',    label: 'Files',     icon: <FolderOpen    size={18} />, route: ROUTES.FILES    },
  { id: 'calls',    label: 'Calls',     icon: <Video         size={18} />, route: ROUTES.CALLS    },
]

function Divider() {
  return (
    <div
      className="my-1 h-px w-8 self-center"
      style={{ background: 'rgba(255,255,255,0.07)' }}
    />
  )
}

export function NavRail() {
  const navigate     = useNavigate()
  const location     = useLocation()
  const { activeSection, setActiveSection, openSearch } = useUIStore()
  const { user }     = useAuthStore()
  const { channels } = useChannelStore()

  const totalUnread = channels.reduce((s, c) => s + c.unreadCount, 0)
  const hasMention  = channels.some((c) => c.hasMention)

  function go(item: NavItem) {
    setActiveSection(item.id)
    navigate(item.route)
  }

  return (
    <aside
      className="flex h-full shrink-0 select-none flex-col items-center py-3 gap-0.5"
      style={{
        width: 'var(--rail-w)',
        background: '#141416',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Logo */}
      <div className="mb-3 flex items-center justify-center">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: '#5C5CDB' }}
        >
          <span className="text-sm font-bold text-white tracking-tight">N</span>
        </div>
      </div>

      {/* Search */}
      <Tooltip content="Search  ⌘K" side="right" delayDuration={200}>
        <button onClick={openSearch} aria-label="Search" className="rail-btn focus-ring">
          <Search size={17} />
        </button>
      </Tooltip>

      <Divider />

      {/* Nav */}
      <nav className="flex flex-1 flex-col items-center gap-0.5">
        {NAV.map((item) => {
          const isActive = activeSection === item.id || location.pathname.startsWith(item.route)
          const badge    = item.id === 'activity' && totalUnread > 0 ? totalUnread : undefined

          return (
            <Tooltip key={item.id} content={item.label} side="right" delayDuration={200}>
              <button
                onClick={() => go(item)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={cn('rail-btn focus-ring', isActive && 'active')}
              >
                {item.icon}
                {badge !== undefined && (
                  <span className={cn('unread-badge absolute -top-1 -right-1 text-[9px] h-4 min-w-[14px]',
                    hasMention ? 'mention' : '')}>
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </button>
            </Tooltip>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-1">
        <Divider />

        <Tooltip content="Settings" side="right" delayDuration={200}>
          <button
            onClick={() => navigate(ROUTES.SETTINGS)}
            aria-label="Settings"
            className={cn('rail-btn focus-ring', location.pathname.startsWith('/settings') && 'active')}
          >
            <Settings size={17} />
          </button>
        </Tooltip>

        {user && (
          <Tooltip content={user.name} side="right" delayDuration={200}>
            <button className="mt-1 rounded-lg focus-ring" aria-label="Profile">
              <Avatar
                initials={user.initials}
                src={user.avatar}
                name={user.name}
                status={user.status}
                size="sm"
              />
            </button>
          </Tooltip>
        )}
      </div>
    </aside>
  )
}
