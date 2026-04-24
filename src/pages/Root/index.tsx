import { Navigate } from 'react-router-dom'
import { useChannelStore } from '@/store/channelStore'

/** Redirect / → first channel of the active team */
export default function RootRedirect() {
  const { activeTeamId, activeChannelId, channels } = useChannelStore()

  const firstChannel = channels.find((ch) => ch.teamId === activeTeamId)

  if (firstChannel) {
    return <Navigate to={`/chat/${firstChannel.teamId}/${firstChannel.id}`} replace />
  }

  if (activeChannelId) {
    return <Navigate to="/chat" replace />
  }

  return <Navigate to="/activity" replace />
}
