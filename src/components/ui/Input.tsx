import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '@/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition = 'left',
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex w-full flex-col gap-1">
        {label && <label className="text-xs font-medium text-nx-muted">{label}</label>}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-nx-subtle">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-md border border-nx-border bg-nx-surface',
              'px-3 py-1.5 text-base text-nx-cream placeholder-nx-subtle',
              'transition-colors duration-100',
              'hover:border-nx-border2 focus:border-nx-indigo focus:ring-1 focus:ring-nx-indigo/40',
              icon && iconPosition === 'left' && 'pl-8',
              icon && iconPosition === 'right' && 'pr-8',
              error && 'border-nx-red focus:border-nx-red focus:ring-nx-red/40',
              className,
            )}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className="absolute top-1/2 right-2.5 -translate-y-1/2 text-nx-subtle">
              {icon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-nx-red">{error}</p>}
        {hint && !error && <p className="text-xs text-nx-muted">{hint}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
