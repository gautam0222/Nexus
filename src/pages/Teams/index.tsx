import { Users, Lock, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useChannelStore } from '@/store/channelStore'
import { cn } from '@/utils'

export default function TeamsPage() {
  const { teams, setActiveTeam } = useChannelStore()

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-nx-border px-6 py-3 pl-14">
        <div className="flex items-center gap-3">
          <Users size={18} className="text-nx-muted" />
          <h1 className="text-md font-semibold text-nx-cream">Teams</h1>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={14} />}>
          New Team
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setActiveTeam(team.id)}
              className={cn(
                'group flex items-center gap-4 rounded-xl border border-nx-border bg-nx-surface2',
                'p-4 text-left transition-all hover:border-nx-border2 hover:bg-nx-surface3'
              )}
            >
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white shadow-glow-sm"
                style={{ backgroundColor: team.color }}
              >
                {team.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-nx-cream">{team.name}</span>
                  {team.isPrivate && <Lock size={12} className="text-nx-muted" />}
                </div>
                <p className="mt-0.5 truncate text-sm text-nx-muted">{team.description}</p>
                <div className="mt-2 flex items-center gap-3">
                  <Badge variant="default">{team.memberCount} members</Badge>
                </div>
              </div>
              <ChevronRight size={16} className="flex-shrink-0 text-nx-subtle opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}

          {/* Add team card */}
          <button className={cn(
            'flex items-center justify-center gap-3 rounded-xl border border-dashed border-nx-border',
            'p-4 text-nx-muted transition-all hover:border-nx-border2 hover:text-nx-cream hover:bg-nx-surface2'
          )}>
            <Plus size={20} />
            <span className="text-sm font-medium">Create new team</span>
          </button>
        </div>
      </div>
    </div>
  )
}
