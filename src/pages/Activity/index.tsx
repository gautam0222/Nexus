import { Bell, AtSign, MessageSquare, Heart } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { MOCK_NOTIFICATIONS } from '@/mockData'
import { formatTime, cn } from '@/utils'

const iconMap = {
  mention:  <AtSign size={14} className="text-nx-indigo-l" />,
  reply:    <MessageSquare size={14} className="text-nx-mint" />,
  reaction: <Heart size={14} className="text-nx-red" />,
  dm:       <MessageSquare size={14} className="text-nx-amber" />,
  call:     <Bell size={14} className="text-nx-muted" />,
}

export default function ActivityPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center gap-3 border-b border-nx-border px-6 py-3 pl-14">
        <Bell size={18} className="text-nx-muted" />
        <h1 className="text-md font-semibold text-nx-cream">Activity</h1>
        <Badge variant="indigo">{MOCK_NOTIFICATIONS.filter(n => !n.isRead).length} new</Badge>
      </header>

      {/* Filter tabs */}
      <div className="flex flex-shrink-0 gap-1 border-b border-nx-border px-4 pt-2">
        {['All', 'Mentions', 'Replies', 'Reactions'].map((tab, i) => (
          <button
            key={tab}
            className={cn(
              'px-3 py-2 text-sm font-medium transition-colors',
              'border-b-2 -mb-px',
              i === 0
                ? 'border-nx-indigo text-nx-indigo-l'
                : 'border-transparent text-nx-muted hover:text-nx-cream'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div
            key={notif.id}
            className={cn(
              'flex items-start gap-3 border-b border-nx-border px-5 py-3.5',
              'cursor-pointer transition-colors hover:bg-nx-surface2',
              !notif.isRead && 'bg-nx-indigo/[0.04]'
            )}
          >
            {/* Unread dot */}
            <div className="mt-1.5 flex w-2 flex-shrink-0 items-center">
              {!notif.isRead && (
                <span className="h-2 w-2 rounded-full bg-nx-indigo" />
              )}
            </div>

            {/* Avatar */}
            <Avatar
              initials={notif.message.author.initials}
              status={notif.message.author.status}
              size="md"
            />

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-nx-cream">
                  {notif.message.author.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-nx-muted">
                  {iconMap[notif.type]}
                  {notif.type}
                </span>
                <span className="ml-auto text-xs text-nx-subtle">
                  {formatTime(notif.createdAt)}
                </span>
              </div>
              <p className="mt-0.5 truncate text-sm text-nx-muted">
                {notif.message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
