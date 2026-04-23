import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'
import { cn } from '@/utils'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  className?: string
}

export function Tooltip({
  content,
  children,
  side = 'right',
  align = 'center',
  delayDuration = 400,
  className,
}: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={6}
            className={cn(
              'z-50 rounded-md border border-nx-border bg-nx-surface3 px-2.5 py-1.5',
              'text-xs font-medium text-nx-cream shadow-glow-md',
              'animate-fade-in',
              className,
            )}
          >
            {content}
            <RadixTooltip.Arrow className="fill-nx-surface3" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
