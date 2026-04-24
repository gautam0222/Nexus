import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChannelHeader }   from '@/components/chat/ChannelHeader'
import { MessageList }     from '@/components/chat/MessageList'
import { Composer }        from '@/components/chat/Composer'
import { ThreadPanel }     from '@/components/chat/ThreadPanel'
import { MemberListPanel } from '@/components/chat/MemberListPanel'
import { useChannelStore } from '@/store/channelStore'
import { useUIStore }      from '@/store/uiStore'

export default function ChatPage() {
  const { teamId, channelId } = useParams()
  const { setActiveChannel, setActiveTeam, markChannelRead } = useChannelStore()
  const { threadPanelOpen, rightPanelOpen } = useUIStore()

  // Sync URL params → store
  useEffect(() => {
    if (teamId)    setActiveTeam(teamId)
    if (channelId) {
      setActiveChannel(channelId)
      markChannelRead(channelId)
    }
  }, [teamId, channelId, setActiveChannel, setActiveTeam, markChannelRead])

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* ── Main chat column ────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ChannelHeader />
        <MessageList />
        <Composer />
      </div>

      {/* ── Thread panel ─────────────────────────────────── */}
      {threadPanelOpen && <ThreadPanel />}

      {/* ── Member list panel ────────────────────────────── */}
      {rightPanelOpen && <MemberListPanel />}
    </div>
  )
}