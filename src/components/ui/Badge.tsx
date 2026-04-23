import type { ReactNode } from 'react'
import { cn } from '@/utils'

type BadgeVariant = 'default' | 'indigo' | 'mint' | 'amber' | 'red' | 'outline'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-nx-surface2 text-nx-muted',
  indigo: 'bg-nx-indigo/15 text-nx-indigo-l',
  mint: 'bg-nx-mint/15 text-nx-mint',
  amber: 'bg-nx-amber/15 text-nx-amber',
  red: 'bg-nx-red/15 text-nx-red',
  outline: 'border border-nx-border text-nx-muted',
}

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-2xs font-semibold',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function UnreadBadge({
  count,
  mention,
}: {
  count: number
  mention?: boolean
}) {
  if (count === 0) return null

  return (
    <span
      className={cn(
        'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1',
        'text-2xs font-bold tabular-nums',
        mention ? 'bg-nx-red text-white' : 'bg-nx-indigo text-white',
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
