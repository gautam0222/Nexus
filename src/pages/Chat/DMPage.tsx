import { useParams } from 'react-router-dom'
import { Phone, Video, MoreHorizontal, Info } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { Badge } from '@/components/ui/Badge'
import { MessageItem } from '@/components/chat/MessageItem'
import { Composer } from '@/components/chat/Composer'
import { MOCK_USERS, MOCK_MESSAGES } from '@/mockData'
import { cn } from '@/utils'
import type { User } from '@/types'

const STATUS_COLOR: Record<User['status'], string> = {
  online:  'text-nx-mint',
  busy:    'text-nx-amber',
  away:    'text-nx-amber/70',
  offline: 'text-nx-subtle',
}
const STATUS_LABEL: Record<User['status'], string> = {
  online: 'Active now', busy: 'Do not disturb', away: 'Away', offline: 'Offline',
}

export default function DMPage() {
  const { userId } = useParams()
  const other = MOCK_USERS.find((u) => u.id === userId) ?? MOCK_USERS[1]

  // Use first 3 mock messages as DM conversation
  const dmMessages = MOCK_MESSAGES.slice(0, 3).map((m, i) => ({
    ...m,
    channelId: `dm-${other.id}`,
    authorId:  i % 2 === 0 ? other.id : MOCK_USERS[0].id,
    author:    i % 2 === 0 ? other : MOCK_USERS[0],
  }))

  return (
    <div className="flex h-full flex-col">
      {/* DM Header */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-nx-border px-4 py-3 pl-12">
        <div className="flex items-center gap-3">
          <Avatar
            initials={other.initials}
            name={other.name}
            status={other.status}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-md font-semibold text-nx-cream">{other.name}</h1>
              {other.role === 'owner' && <Badge variant="amber">Owner</Badge>}
              {other.role === 'admin' && <Badge variant="indigo">Admin</Badge>}
            </div>
            <p className={cn('text-xs font-medium', STATUS_COLOR[other.status])}>
              {STATUS_LABEL[other.status]}
              {other.title && (
                <span className="ml-1.5 font-normal text-nx-subtle">· {other.title}</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip content="Voice call" side="bottom">
            <Button variant="ghost" size="sm" icon={<Phone size={15} />} />
          </Tooltip>
          <Tooltip content="Video call" side="bottom">
            <Button variant="ghost" size="sm" icon={<Video size={15} />} />
          </Tooltip>
          <Tooltip content="Profile info" side="bottom">
            <Button variant="ghost" size="sm" icon={<Info size={15} />} />
          </Tooltip>
          <Button variant="ghost" size="sm" icon={<MoreHorizontal size={15} />} />
        </div>
      </header>

      {/* Profile card at top of conversation */}
      <div className="flex-shrink-0 border-b border-nx-border bg-nx-surface2/40 px-8 py-6">
        <div className="flex items-center gap-4">
          <Avatar initials={other.initials} status={other.status} size="xl" />
          <div>
            <h2 className="text-xl font-bold text-nx-cream">{other.name}</h2>
            {other.title && <p className="mt-0.5 text-sm text-nx-muted">{other.title}</p>}
            <p className="mt-1 text-xs text-nx-subtle">{other.email}</p>
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" size="xs" icon={<Phone size={12} />}>Call</Button>
              <Button variant="secondary" size="xs" icon={<Video size={12} />}>Video</Button>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-nx-muted">
          This is the beginning of your direct message history with{' '}
          <span className="font-semibold text-nx-cream">{other.name}</span>.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-2">
        {dmMessages.map((msg, i) => {
          const prev = dmMessages[i - 1]
          const isGrouped =
            !!prev && prev.authorId === msg.authorId &&
            new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 300000
          return <MessageItem key={msg.id} message={msg} isGrouped={isGrouped} />
        })}
      </div>

      {/* Composer */}
      <Composer
        channelId={`dm-${other.id}`}
        placeholder={`Message ${other.name}…`}
      />
    </div>
  )
}
