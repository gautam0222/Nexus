import { useState } from 'react'
import { Settings, User, Bell, Palette, Shield, ChevronRight } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/utils'

type SettingsTab = 'account' | 'notifications' | 'appearance' | 'privacy'

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'account',       label: 'Account',       icon: <User size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  { id: 'appearance',    label: 'Appearance',    icon: <Palette size={16} /> },
  { id: 'privacy',       label: 'Privacy',       icon: <Shield size={16} /> },
]

function AccountTab() {
  const { user } = useAuthStore()
  if (!user) return null
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-md font-semibold text-nx-cream">Profile</h3>
        <div className="flex items-center gap-4 rounded-xl border border-nx-border bg-nx-surface2 p-4">
          <Avatar initials={user.initials} status={user.status} size="xl" />
          <div>
            <p className="font-semibold text-nx-cream">{user.name}</p>
            <p className="text-sm text-nx-muted">{user.email}</p>
          </div>
          <Button variant="secondary" size="sm" className="ml-auto">Change photo</Button>
        </div>
      </div>
      <div className="grid gap-4">
        <Input label="Display name" defaultValue={user.name} />
        <Input label="Email" defaultValue={user.email} type="email" />
        <Input label="Job title" defaultValue={user.title ?? ''} placeholder="e.g. Frontend Engineer" />
      </div>
      <div className="flex justify-end">
        <Button variant="primary" size="md">Save changes</Button>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const items = [
    { label: 'Direct messages', desc: 'Notify me for all DMs', value: true },
    { label: 'Mentions', desc: 'Notify when I am @mentioned', value: true },
    { label: 'Thread replies', desc: 'Notify on replies to my messages', value: true },
    { label: 'Channel messages', desc: 'Notify for every channel message', value: false },
    { label: 'Email digest', desc: 'Weekly summary email', value: false },
  ]
  return (
    <div className="space-y-3">
      <h3 className="mb-4 text-md font-semibold text-nx-cream">Notification preferences</h3>
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between rounded-xl border border-nx-border bg-nx-surface2 px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-nx-cream">{item.label}</p>
            <p className="text-xs text-nx-muted">{item.desc}</p>
          </div>
          <button className={cn(
            'relative h-6 w-11 rounded-full transition-colors duration-200',
            item.value ? 'bg-nx-indigo' : 'bg-nx-surface3'
          )}>
            <span className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
              item.value ? 'translate-x-5.5' : 'translate-x-0.5'
            )} />
          </button>
        </div>
      ))}
    </div>
  )
}

function AppearanceTab() {
  const { theme, toggleTheme } = useUIStore()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-md font-semibold text-nx-cream">Theme</h3>
        <div className="grid grid-cols-2 gap-3">
          {(['dark', 'light'] as const).map((t) => (
            <button
              key={t}
              onClick={() => t !== theme && toggleTheme()}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                theme === t ? 'border-nx-indigo bg-nx-indigo/10' : 'border-nx-border bg-nx-surface2 hover:border-nx-border2'
              )}
            >
              <div className={cn('h-16 w-full rounded-lg', t === 'dark' ? 'bg-[#0F1117]' : 'bg-gray-100')}>
                <div className={cn('m-2 h-3 w-16 rounded', t === 'dark' ? 'bg-nx-indigo/40' : 'bg-indigo-200')} />
                <div className={cn('m-2 mt-1 h-2 w-24 rounded', t === 'dark' ? 'bg-nx-surface3' : 'bg-gray-300')} />
              </div>
              <span className={cn('text-sm font-medium capitalize', theme === t ? 'text-nx-indigo-l' : 'text-nx-muted')}>
                {t} mode
              </span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-md font-semibold text-nx-cream">Accent color</h3>
        <div className="flex gap-3">
          {['#6366F1', '#22D3A5', '#F59E0B', '#F43F5E', '#8B5CF6', '#06B6D4'].map((color) => (
            <button
              key={color}
              className={cn('h-8 w-8 rounded-full transition-transform hover:scale-110', color === '#6366F1' && 'ring-2 ring-offset-2 ring-offset-nx-surface ring-white/30')}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PrivacyTab() {
  const items = [
    { label: 'Read receipts', desc: 'Let others see when you\'ve read messages' },
    { label: 'Presence visibility', desc: 'Show your online/offline status' },
    { label: 'Profile visibility', desc: 'Allow others to view your full profile' },
  ]
  return (
    <div className="space-y-3">
      <h3 className="mb-4 text-md font-semibold text-nx-cream">Privacy settings</h3>
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between rounded-xl border border-nx-border bg-nx-surface2 px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-nx-cream">{item.label}</p>
            <p className="text-xs text-nx-muted">{item.desc}</p>
          </div>
          <button className="relative h-6 w-11 rounded-full bg-nx-indigo transition-colors">
            <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
          </button>
        </div>
      ))}
      <div className="mt-6 rounded-xl border border-nx-red/20 bg-nx-red/5 p-4">
        <p className="text-sm font-semibold text-nx-red">Danger zone</p>
        <p className="mt-1 text-xs text-nx-muted">Permanent account actions. Proceed with caution.</p>
        <Button variant="danger" size="sm" className="mt-3">Delete account</Button>
      </div>
    </div>
  )
}

const TAB_CONTENT: Record<SettingsTab, React.ReactNode> = {
  account:       <AccountTab />,
  notifications: <NotificationsTab />,
  appearance:    <AppearanceTab />,
  privacy:       <PrivacyTab />,
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-shrink-0 items-center gap-3 border-b border-nx-border px-6 py-3 pl-14">
        <Settings size={18} className="text-nx-muted" />
        <h1 className="text-md font-semibold text-nx-cream">Settings</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings sidebar */}
        <nav className="w-56 flex-shrink-0 border-r border-nx-border bg-nx-graphite p-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors',
                activeTab === tab.id
                  ? 'bg-nx-indigo/15 text-nx-indigo-l'
                  : 'text-nx-muted hover:bg-nx-surface2 hover:text-nx-cream'
              )}
            >
              <div className="flex items-center gap-2.5">
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </div>
              <ChevronRight size={14} className="opacity-40" />
            </button>
          ))}
        </nav>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-lg">
            {TAB_CONTENT[activeTab]}
          </div>
        </div>
      </div>
    </div>
  )
}
