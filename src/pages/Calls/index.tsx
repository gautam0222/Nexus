import { Video, Phone, PhoneIncoming, PhoneMissed, PhoneOutgoing, Plus } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { MOCK_USERS } from '@/mockData'
import { cn } from '@/utils'

const CALL_LOG = [
  { id: 'c1', participants: [MOCK_USERS[1]], type: 'incoming', status: 'answered', duration: '12m 34s', time: '2h ago', isVideo: true },
  { id: 'c2', participants: [MOCK_USERS[2]], type: 'outgoing', status: 'answered', duration: '4m 12s', time: '5h ago', isVideo: false },
  { id: 'c3', participants: [MOCK_USERS[3], MOCK_USERS[4]], type: 'incoming', status: 'missed', duration: null, time: 'Yesterday', isVideo: false },
  { id: 'c4', participants: [MOCK_USERS[1], MOCK_USERS[2], MOCK_USERS[5]], type: 'outgoing', status: 'answered', duration: '38m 00s', time: 'Yesterday', isVideo: true },
]

function CallIcon({ type, status }: { type: string; status: string }) {
  if (status === 'missed') return <PhoneMissed size={16} className="text-nx-red" />
  if (type === 'incoming') return <PhoneIncoming size={16} className="text-nx-mint" />
  return <PhoneOutgoing size={16} className="text-nx-indigo-l" />
}

export default function CallsPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-nx-border px-6 py-3 pl-14">
        <div className="flex items-center gap-3">
          <Video size={18} className="text-nx-muted" />
          <h1 className="text-md font-semibold text-nx-cream">Calls</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={<Phone size={14} />}>Audio call</Button>
          <Button variant="primary" size="sm" icon={<Video size={14} />}>Video call</Button>
        </div>
      </header>

      {/* Start a call banner */}
      <div className="flex-shrink-0 border-b border-nx-border bg-nx-indigo/5 p-5">
        <div className="flex items-center justify-between rounded-xl border border-nx-indigo/20 bg-nx-indigo/10 p-4">
          <div>
            <p className="font-semibold text-nx-cream">Start an instant meeting</p>
            <p className="mt-0.5 text-sm text-nx-muted">Invite anyone from your team with a link</p>
          </div>
          <Button variant="primary" size="sm" icon={<Plus size={14} />}>New meeting</Button>
        </div>
      </div>

      {/* Call log */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-nx-subtle mb-2">Recent</h2>
        </div>
        {CALL_LOG.map((call) => (
          <div key={call.id} className="flex items-center gap-4 border-b border-nx-border/50 px-5 py-3.5 transition-colors hover:bg-nx-surface2 cursor-pointer">
            {/* Avatars */}
            <div className="relative flex-shrink-0">
              <Avatar initials={call.participants[0].initials} status={call.participants[0].status} size="md" />
              {call.participants.length > 1 && (
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-nx-surface3 text-2xs font-bold text-nx-muted ring-2 ring-nx-surface">
                  +{call.participants.length - 1}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={cn('text-sm font-semibold', call.status === 'missed' ? 'text-nx-red' : 'text-nx-cream')}>
                  {call.participants.map(p => p.name.split(' ')[0]).join(', ')}
                </span>
                {call.isVideo && <Badge variant="indigo">Video</Badge>}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-nx-muted">
                <CallIcon type={call.type} status={call.status} />
                <span className="capitalize">{call.status}</span>
                {call.duration && <><span>·</span><span>{call.duration}</span></>}
                <span>·</span><span>{call.time}</span>
              </div>
            </div>

            {/* Callback button */}
            <Button variant="ghost" size="sm" icon={call.isVideo ? <Video size={15} /> : <Phone size={15} />} />
          </div>
        ))}
      </div>
    </div>
  )
}
