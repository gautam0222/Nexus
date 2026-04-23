import type { UserStatus } from '@/types'
import { cn } from '@/utils'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string
  initials: string
  name?: string
  size?: AvatarSize
  status?: UserStatus
  color?: string
  className?: string
}

const sizeMap: Record<
  AvatarSize,
  { outer: string; text: string; dot: string; dotPos: string }
> = {
  xs: {
    outer: 'h-5 w-5',
    text: 'text-2xs',
    dot: 'h-1.5 w-1.5',
    dotPos: '-bottom-px -right-px',
  },
  sm: {
    outer: 'h-6 w-6',
    text: 'text-xs',
    dot: 'h-2 w-2',
    dotPos: '-bottom-px -right-px',
  },
  md: {
    outer: 'h-8 w-8',
    text: 'text-sm',
    dot: 'h-2.5 w-2.5',
    dotPos: 'bottom-0 right-0',
  },
  lg: {
    outer: 'h-10 w-10',
    text: 'text-base',
    dot: 'h-3 w-3',
    dotPos: 'bottom-0 right-0',
  },
  xl: {
    outer: 'h-12 w-12',
    text: 'text-md',
    dot: 'h-3.5 w-3.5',
    dotPos: 'bottom-0.5 right-0.5',
  },
}

const statusColors: Record<UserStatus, string> = {
  online: 'bg-nx-mint',
  busy: 'bg-nx-amber',
  away: 'bg-nx-amber/60',
  offline: 'bg-nx-subtle',
}

const AVATAR_COLORS = [
  'bg-indigo-500/20 text-indigo-300',
  'bg-teal-500/20 text-teal-300',
  'bg-amber-500/20 text-amber-300',
  'bg-rose-500/20 text-rose-300',
  'bg-violet-500/20 text-violet-300',
  'bg-cyan-500/20 text-cyan-300',
]

function getColorIndex(initials: string): number {
  const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)
  return code % AVATAR_COLORS.length
}

export function Avatar({
  src,
  initials,
  name,
  size = 'md',
  status,
  color,
  className,
}: AvatarProps) {
  const { outer, text, dot, dotPos } = sizeMap[size]
  const colorClass = color ?? AVATAR_COLORS[getColorIndex(initials)]

  return (
    <div className={cn('relative shrink-0', outer, className)}>
      {src ? (
        <img
          src={src}
          alt={name ?? initials}
          className={cn('rounded-full object-cover', outer)}
        />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center rounded-full font-semibold',
            outer,
            text,
            colorClass,
          )}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={cn(
            'absolute block rounded-full ring-2 ring-nx-graphite',
            dot,
            dotPos,
            statusColors[status],
          )}
          title={status}
        />
      )}
    </div>
  )
}

interface AvatarGroupProps {
  users: { initials: string; name?: string; src?: string }[]
  max?: number
  size?: AvatarSize
}

export function AvatarGroup({
  users,
  max = 3,
  size = 'sm',
}: AvatarGroupProps) {
  const visible = users.slice(0, max)
  const overflow = users.length - max

  return (
    <div className="flex -space-x-1.5">
      {visible.map((user, index) => (
        <Avatar
          key={index}
          initials={user.initials}
          name={user.name}
          src={user.src}
          size={size}
          className="ring-2 ring-nx-graphite"
        />
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full',
            'bg-nx-surface2 text-nx-muted ring-2 ring-nx-graphite',
            sizeMap[size].outer,
            sizeMap[size].text,
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
