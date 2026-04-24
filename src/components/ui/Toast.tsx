import { createContext, useContext, useCallback, useState, useRef, useEffect } from 'react'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number   // ms — 0 = persist until dismissed
  action?: { label: string; onClick: () => void }
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (t: Omit<Toast, 'id'>) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

// ─── Shorthand helpers ────────────────────────────────────────────────────────

export function useToastHelpers() {
  const { toast } = useToast()
  return {
    success: (title: string, description?: string) =>
      toast({ title, description, variant: 'success', duration: 3500 }),
    error: (title: string, description?: string) =>
      toast({ title, description, variant: 'error', duration: 5000 }),
    info: (title: string, description?: string) =>
      toast({ title, description, variant: 'info', duration: 3500 }),
    warning: (title: string, description?: string) =>
      toast({ title, description, variant: 'warning', duration: 4000 }),
  }
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="text-nx-mint" />,
  error:   <AlertCircle  size={16} className="text-nx-red" />,
  info:    <Info         size={16} className="text-nx-indigo-l" />,
  warning: <AlertTriangle size={16} className="text-nx-amber" />,
}

const PROGRESS_COLORS: Record<ToastVariant, string> = {
  success: 'bg-nx-mint',
  error:   'bg-nx-red',
  info:    'bg-nx-indigo',
  warning: 'bg-nx-amber',
}

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedAt   = useRef(Date.now())
  const duration    = t.duration ?? 4000

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  // Progress bar countdown
  useEffect(() => {
    if (duration === 0) return
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt.current
      const pct = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(pct)
      if (pct === 0) {
        clearInterval(intervalRef.current!)
        handleDismiss()
      }
    }, 50)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [duration])

  function handleDismiss() {
    setVisible(false)
    setTimeout(onDismiss, 250)
  }

  const variant = t.variant ?? 'info'

  return (
    <div
      className={cn(
        'relative flex w-80 flex-col overflow-hidden rounded-xl border border-nx-border',
        'bg-nx-surface shadow-glow-md transition-all duration-250',
        visible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0',
      )}
    >
      {/* Main content */}
      <div className="flex items-start gap-3 p-3.5">
        <span className="mt-0.5 flex-shrink-0">{ICONS[variant]}</span>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-semibold text-nx-cream">{t.title}</p>
          {t.description && (
            <p className="mt-0.5 text-xs text-nx-muted">{t.description}</p>
          )}
          {t.action && (
            <button
              onClick={() => { t.action!.onClick(); handleDismiss() }}
              className="mt-1.5 text-xs font-semibold text-nx-indigo-l hover:underline"
            >
              {t.action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 rounded p-0.5 text-nx-subtle transition-colors hover:bg-nx-surface2 hover:text-nx-muted"
        >
          <X size={13} />
        </button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-0.5 w-full bg-nx-surface3">
          <div
            className={cn('h-full transition-all', PROGRESS_COLORS[variant])}
            style={{ width: `${progress}%`, transitionDuration: '50ms' }}
          />
        </div>
      )}
    </div>
  )
}

// ─── Toast Stack ──────────────────────────────────────────────────────────────

function ToastStack({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  if (toasts.length === 0) return null
  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((t: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev.slice(-4), { ...t, id }]) // max 5 at once
    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissAll = useCallback(() => setToasts([]), [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}
