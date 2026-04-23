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
  { id: 'activity', label: 'Activity',  icon: <Bell         size={16} />, route: ROUTES.ACTIVITY },
  { id: 'chat',     label: 'Chat',      icon: <MessageSquare size={16} />, route: ROUTES.CHAT     },
  { id: 'teams',    label: 'Teams',     icon: <Users         size={16} />, route: ROUTES.TEAMS    },
  { id: 'calendar', label: 'Calendar',  icon: <CalendarDays  size={16} />, route: ROUTES.CALENDAR },
  { id: 'files',    label: 'Files',     icon: <FolderOpen    size={16} />, route: ROUTES.FILES    },
  { id: 'calls',    label: 'Calls',     icon: <Video         size={16} />, route: ROUTES.CALLS    },
]

// ─── Logo ─────────────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <div className="mb-2 flex items-center justify-center">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #FF0055 0%, #9D00FF 100%)',
          boxShadow: '0 0 20px rgba(255,0,85,0.55), 0 0 40px rgba(157,0,255,0.35)',
        }}
      >
        <span
          className="text-md font-black text-white tracking-tighter"
          style={{ textShadow: '0 0 8px rgba(255,255,255,0.60)' }}
        >
          N
        </span>
      </div>
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Dashes() {
  return (
    <div
      className="my-1.5 h-px w-7 self-center rounded-full"
      style={{ background: 'rgba(0,238,255,0.08)' }}
    />
  )
}

// ─── NavRail — RIGHT side ─────────────────────────────────────────────────────
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
      className="flex h-full shrink-0 flex-col items-center py-3 gap-0.5"
      style={{
        width: 'var(--rail-w)',
        background: 'linear-gradient(180deg, #0D0D25 0%, #07071A 100%)',
        borderLeft: '1px solid rgba(0,238,255,0.06)',
      }}
    >
      <LogoMark />

      {/* Search */}
      <Tooltip content="Search  ⌘K" side="left" delayDuration={300}>
        <button
          onClick={openSearch}
          aria-label="Search"
          className="rail-btn focus-ring mb-1"
        >
          <Search size={16} />
        </button>
      </Tooltip>

      <Dashes />

      {/* Nav items */}
      <nav className="flex flex-1 flex-col items-center gap-0.5 pt-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            activeSection === item.id || location.pathname.startsWith(item.route)
          const badge =
            item.id === 'activity' && totalUnread > 0 ? totalUnread : undefined

          return (
            <Tooltip key={item.id} content={item.label} side="left" delayDuration={300}>
              <button
                onClick={() => handleNav(item)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={cn('rail-btn focus-ring', isActive && 'active')}
              >
                {item.icon}
                {badge !== undefined && (
                  <span
                    className={cn('unread-badge', hasMention ? 'bg-nx-pink' : 'bg-nx-cyan text-black')}
                  >
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </button>
            </Tooltip>
          )
        })}
      </nav>

      {/* Bottom controls */}
      <div className="flex flex-col items-center gap-1">
        <Dashes />

        <Tooltip content="New" side="left" delayDuration={300}>
          <button className="rail-btn focus-ring" aria-label="Create new">
            <Plus size={16} />
          </button>
        </Tooltip>

        <Tooltip content="Settings" side="left" delayDuration={300}>
          <button
            onClick={() => navigate(ROUTES.SETTINGS)}
            aria-label="Settings"
            className={cn('rail-btn focus-ring', location.pathname.startsWith('/settings') && 'active')}
          >
            <Settings size={16} />
          </button>
        </Tooltip>

        {user && (
          <Tooltip content={`${user.name} // ${user.status}`} side="left" delayDuration={300}>
            <button className="mt-1 rounded-xl focus-ring" aria-label="Your profile">
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
