import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, CalendarDays, FolderOpen,
  MessageSquare, Plus, Search, Settings, Users, Video,
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

const NAV_ITEMS: NavItem[] = [
  { id: 'activity', label: 'Activity',  icon: <Bell size={17} />,          route: ROUTES.ACTIVITY  },
  { id: 'chat',     label: 'Chat',      icon: <MessageSquare size={17} />, route: ROUTES.CHAT      },
  { id: 'teams',    label: 'Teams',     icon: <Users size={17} />,         route: ROUTES.TEAMS     },
  { id: 'calendar', label: 'Calendar',  icon: <CalendarDays size={17} />,  route: ROUTES.CALENDAR  },
  { id: 'files',    label: 'Files',     icon: <FolderOpen size={17} />,    route: ROUTES.FILES     },
  { id: 'calls',    label: 'Calls',     icon: <Video size={17} />,         route: ROUTES.CALLS     },
]

// ─── Logo mark ────────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center">
      {/* Glow halo */}
      <div
        className="absolute inset-0 rounded-xl opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 70%)' }}
      />
      {/* Icon surface */}
      <div
        className="relative flex h-8 w-8 items-center justify-center rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
          boxShadow: '0 0 16px rgba(139,92,246,0.50), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}
      >
        <span className="text-md font-bold text-white tracking-tight">N</span>
      </div>
    </div>
  )
}

// ─── Single nav rail button ───────────────────────────────────────────────────
function RailButton({
  item,
  isActive,
  badge,
  hasMention,
  onClick,
}: {
  item: NavItem
  isActive: boolean
  badge?: number
  hasMention?: boolean
  onClick: () => void
}) {
  return (
    <Tooltip content={item.label} side="right" delayDuration={300}>
      <button
        onClick={onClick}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        className={cn('rail-btn focus-ring', isActive && 'active')}
      >
        {item.icon}

        {badge !== undefined && badge > 0 && (
          <span
            className={cn(
              'unread-badge',
              hasMention ? 'bg-nx-red' : 'bg-nx-violet',
            )}
          >
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </button>
    </Tooltip>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function RailDivider() {
  return (
    <div
      className="my-1 h-px w-7 self-center rounded-full"
      style={{ background: 'rgba(255,255,255,0.06)' }}
    />
  )
}

// ─── NavRail ──────────────────────────────────────────────────────────────────
export function NavRail() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { activeSection, setActiveSection, openSearch } = useUIStore()
  const { user }   = useAuthStore()
  const { channels } = useChannelStore()

  const totalUnread = channels.reduce((s, c) => s + c.unreadCount, 0)
  const hasMention  = channels.some((c) => c.hasMention)

  function handleNav(item: NavItem) {
    setActiveSection(item.id)
    navigate(item.route)
  }

  return (
    <aside
      className="flex h-full w-rail select-none flex-col items-center py-3 gap-0.5"
      style={{
        width: 'var(--rail-w)',
        background: 'linear-gradient(180deg, #0C0C16 0%, #11111F 100%)',
        borderRight: '1px solid rgba(255,255,255,0.045)',
      }}
    >
      {/* Logo */}
      <div className="mb-3 flex items-center justify-center">
        <LogoMark />
      </div>

      {/* Search */}
      <Tooltip content="Search  ⌘K" side="right" delayDuration={300}>
        <button
          onClick={openSearch}
          aria-label="Search"
          className="rail-btn focus-ring mb-1"
        >
          <Search size={17} />
        </button>
      </Tooltip>

      <RailDivider />

      {/* Nav items */}
      <nav className="flex flex-1 flex-col items-center gap-0.5 pt-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            activeSection === item.id || location.pathname.startsWith(item.route)
          const badge =
            item.id === 'activity' && totalUnread > 0 ? totalUnread : undefined

          return (
            <RailButton
              key={item.id}
              item={item}
              isActive={isActive}
              badge={badge}
              hasMention={hasMention}
              onClick={() => handleNav(item)}
            />
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-1">
        <RailDivider />

        <Tooltip content="New" side="right" delayDuration={300}>
          <button className="rail-btn focus-ring" aria-label="Create new">
            <Plus size={17} />
          </button>
        </Tooltip>

        <Tooltip content="Settings" side="right" delayDuration={300}>
          <button
            onClick={() => navigate(ROUTES.SETTINGS)}
            aria-label="Settings"
            className={cn(
              'rail-btn focus-ring',
              location.pathname.startsWith('/settings') && 'active',
            )}
          >
            <Settings size={17} />
          </button>
        </Tooltip>

        {user && (
          <Tooltip content={`${user.name} · ${user.status}`} side="right" delayDuration={300}>
            <button
              className="mt-1 rounded-xl focus-ring"
              aria-label="Your profile"
            >
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
