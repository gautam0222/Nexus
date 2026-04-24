import { Hash, Users, Bell, Pin, Search } from 'lucide-react'
import { useChannelStore } from '@/store/channelStore'
import { useUIStore } from '@/store'
import { cn } from '@/utils'

export function ChannelHeader() {
  const { activeChannelId, getChannel } = useChannelStore()
  const { toggleRightPanel, rightPanelOpen } = useUIStore()
  const channel = activeChannelId ? getChannel(activeChannelId) : null

  if (!channel) return null

  return (
    <header className="flex shrink-0 items-center justify-between border-b px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-2 overflow-hidden">
        <Hash size={16} className="shrink-0 text-dim" />
        <h1 className="text-md font-semibold text-hi truncate">{channel.name}</h1>
        {channel.description && (
          <>
            <span className="text-dim">|</span>
            <p className="text-sm text-dim truncate">{channel.description}</p>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button className="nav-btn" title="Search in channel">
          <Search size={15} />
        </button>
        <button className="nav-btn" title="Pinned messages">
          <Pin size={15} />
        </button>
        <button className="nav-btn" title="Notifications">
          <Bell size={15} />
        </button>
        <button
          onClick={toggleRightPanel}
          className={cn('nav-btn', rightPanelOpen && 'active')}
          title="Members"
        >
          <Users size={15} />
        </button>
        <span className="ml-1 text-xs text-dim">{channel.memberCount}</span>
      </div>
    </header>
  )
}
