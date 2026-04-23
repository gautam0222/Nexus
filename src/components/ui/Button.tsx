import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-nx-indigo text-white hover:bg-nx-indigo-d active:scale-[0.98] shadow-sm',
  secondary:
    'bg-nx-surface2 text-nx-cream border border-nx-border hover:bg-nx-surface3 active:scale-[0.98]',
  ghost:
    'text-nx-muted hover:bg-nx-surface2 hover:text-nx-cream active:scale-[0.98]',
  danger:
    'bg-nx-red/10 text-nx-red border border-nx-red/20 hover:bg-nx-red/20 active:scale-[0.98]',
  icon:
    'text-nx-muted hover:bg-nx-surface2 hover:text-nx-cream active:scale-[0.98]',
}

const sizes: Record<ButtonSize, string> = {
  xs: 'h-6 px-2 text-xs rounded',
  sm: 'h-7 px-3 text-sm rounded-md',
  md: 'h-8 px-4 text-base rounded-md',
  lg: 'h-9 px-5 text-md rounded-lg',
}

const iconSizes: Record<ButtonSize, string> = {
  xs: 'h-6 w-6 rounded',
  sm: 'h-7 w-7 rounded-md',
  md: 'h-8 w-8 rounded-md',
  lg: 'h-9 w-9 rounded-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isIcon = variant === 'icon' || (!children && icon)
    const sizeClass = isIcon ? iconSizes[size] : sizes[size]

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 font-medium',
          'transition-all duration-100 focus-ring',
          'disabled:pointer-events-none disabled:opacity-40',
          variants[variant],
          sizeClass,
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <LoadingSpinner size={size} />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'

function LoadingSpinner({ size }: { size: ButtonSize }) {
  const s = size === 'xs' ? 12 : size === 'sm' ? 14 : 16

  return (
    <svg
      className="animate-spin"
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  )
}
