import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Calendar,
  FolderOpen,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Users,
  Video,
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
  badge?: number
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'activity',
    label: 'Activity',
    icon: <Bell size={20} />,
    route: ROUTES.ACTIVITY,
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: <MessageSquare size={20} />,
    route: ROUTES.CHAT,
  },
  {
    id: 'teams',
    label: 'Teams',
    icon: <Users size={20} />,
    route: ROUTES.TEAMS,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: <Calendar size={20} />,
    route: ROUTES.CALENDAR,
  },
  {
    id: 'files',
    label: 'Files',
    icon: <FolderOpen size={20} />,
    route: ROUTES.FILES,
  },
  {
    id: 'calls',
    label: 'Calls',
    icon: <Video size={20} />,
    route: ROUTES.CALLS,
  },
]

export function NavRail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeSection, setActiveSection, openSearch } = useUIStore()
  const { user } = useAuthStore()
  const { channels } = useChannelStore()

  const totalUnread = channels.reduce((sum, channel) => sum + channel.unreadCount, 0)
  const hasMention = channels.some((channel) => channel.hasMention)

  function handleNav(item: NavItem) {
    setActiveSection(item.id)
    navigate(item.route)
  }

  return (
    <aside className="flex h-full w-rail select-none flex-col items-center bg-nx-graphite py-3">
      <div className="mb-3 flex h-10 w-10 items-center justify-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-nx-indigo shadow-glow-sm">
          <span className="text-md font-bold text-white">N</span>
        </div>
      </div>

      <Tooltip content="Search (⌘K)" side="right">
        <button
          onClick={openSearch}
          className="rail-btn mb-1"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </Tooltip>

      <div className="my-2 h-px w-8 bg-nx-border" />

      <nav className="flex flex-1 flex-col items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            activeSection === item.id || location.pathname.startsWith(item.route)

          const badge =
            item.id === 'activity' && totalUnread > 0 ? totalUnread : item.badge

          return (
            <Tooltip key={item.id} content={item.label} side="right">
              <button
                onClick={() => handleNav(item)}
                className={cn('rail-btn', isActive && 'active')}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon}
                {badge !== undefined && (
                  <span
                    className={cn(
                      'unread-badge',
                      hasMention ? 'bg-nx-red' : 'bg-nx-indigo',
                    )}
                  >
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </button>
            </Tooltip>
          )
        })}
      </nav>

      <div className="flex flex-col items-center gap-1">
        <Tooltip content="Create new" side="right">
          <button className="rail-btn" aria-label="Create new">
            <Plus size={18} />
          </button>
        </Tooltip>

        <Tooltip content="Settings" side="right">
          <button
            onClick={() => navigate(ROUTES.SETTINGS)}
            className={cn(
              'rail-btn',
              location.pathname.startsWith('/settings') && 'active',
            )}
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </Tooltip>

        {user && (
          <Tooltip content={`${user.name} · ${user.status}`} side="right">
            <button className="mt-1" aria-label="Your profile">
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
