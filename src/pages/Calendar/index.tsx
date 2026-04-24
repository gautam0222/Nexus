import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 8am – 7pm

// Mock events
const MOCK_EVENTS = [
  { id: 'e1', title: 'Design Sync', day: 2, hour: 10, duration: 1, color: '#22D3A5', attendees: 4 },
  { id: 'e2', title: 'Sprint Planning', day: 2, hour: 14, duration: 2, color: '#6366F1', attendees: 8 },
  { id: 'e3', title: '1:1 with Alex', day: 4, hour: 11, duration: 1, color: '#F59E0B', attendees: 2 },
  { id: 'e4', title: 'Eng All-Hands', day: 5, hour: 15, duration: 1.5, color: '#F43F5E', attendees: 12 },
]

const now = new Date()

function getDaysOfWeek() {
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export default function CalendarPage() {
  const days = getDaysOfWeek()

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-nx-border px-6 py-3 pl-14">
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-nx-muted" />
          <h1 className="text-md font-semibold text-nx-cream">Calendar</h1>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" icon={<ChevronLeft size={14} />} />
            <span className="text-sm font-medium text-nx-cream">
              {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="ghost" size="sm" icon={<ChevronRight size={14} />} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-nx-border overflow-hidden">
            {['Day', 'Week', 'Month'].map((v, i) => (
              <button
                key={v}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-colors',
                  i === 1 ? 'bg-nx-indigo text-white' : 'text-nx-muted hover:bg-nx-surface2'
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <Button variant="primary" size="sm" icon={<Plus size={14} />}>New event</Button>
        </div>
      </header>

      {/* Week grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Time column */}
        <div className="w-16 flex-shrink-0 border-r border-nx-border pt-12">
          {HOURS.map((h) => (
            <div key={h} className="relative h-16 pr-2 text-right">
              <span className="absolute -top-2 right-2 text-xs text-nx-subtle">
                {h > 12 ? `${h - 12}pm` : h === 12 ? '12pm' : `${h}am`}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="flex flex-1 overflow-x-auto">
          {days.map((day, dayIdx) => {
            const isToday = day.toDateString() === now.toDateString()
            return (
              <div key={dayIdx} className="flex min-w-0 flex-1 flex-col border-r border-nx-border">
                {/* Day header */}
                <div className={cn(
                  'flex h-12 flex-shrink-0 flex-col items-center justify-center border-b border-nx-border',
                  isToday && 'bg-nx-indigo/5'
                )}>
                  <span className={cn('text-xs font-medium', isToday ? 'text-nx-indigo-l' : 'text-nx-muted')}>
                    {DAYS[dayIdx]}
                  </span>
                  <span className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold',
                    isToday ? 'bg-nx-indigo text-white' : 'text-nx-cream'
                  )}>
                    {day.getDate()}
                  </span>
                </div>

                {/* Hour slots */}
                <div className="relative flex-1">
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="h-16 border-b border-nx-border/50 hover:bg-nx-surface2/50 cursor-pointer transition-colors"
                    />
                  ))}

                  {/* Events for this day */}
                  {MOCK_EVENTS.filter((e) => e.day === dayIdx).map((event) => (
                    <div
                      key={event.id}
                      className="absolute left-1 right-1 overflow-hidden rounded-md px-2 py-1 cursor-pointer hover:brightness-110 transition-all"
                      style={{
                        top: `${(event.hour - 8) * 64 + 2}px`,
                        height: `${event.duration * 64 - 4}px`,
                        backgroundColor: `${event.color}22`,
                        borderLeft: `2px solid ${event.color}`,
                      }}
                    >
                      <p className="truncate text-xs font-semibold" style={{ color: event.color }}>
                        {event.title}
                      </p>
                      <p className="text-xs text-nx-muted">{event.attendees} attendees</p>
                    </div>
                  ))}

                  {/* Current time indicator */}
                  {isToday && (
                    <div
                      className="absolute left-0 right-0 flex items-center"
                      style={{ top: `${((now.getHours() - 8) * 60 + now.getMinutes()) / 60 * 64}px` }}
                    >
                      <div className="h-2 w-2 rounded-full bg-nx-indigo -ml-1" />
                      <div className="h-px flex-1 bg-nx-indigo" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
