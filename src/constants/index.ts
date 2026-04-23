export const ROUTES = {
  ROOT: '/',
  ACTIVITY: '/activity',
  CHAT: '/chat',
  CHANNEL: '/chat/:teamId/:channelId',
  DM: '/dm/:userId',
  TEAMS: '/teams',
  TEAM: '/teams/:teamId',
  CALENDAR: '/calendar',
  FILES: '/files',
  CALLS: '/calls',
  SETTINGS: '/settings',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_APPEARANCE: '/settings/appearance',
  SETTINGS_PRIVACY: '/settings/privacy',
} as const

export const APP_CONFIG = {
  name: 'Nexus',
  version: '0.1.0',
  api: {
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
    timeout: 10_000,
  },
  ws: {
    url: import.meta.env.VITE_WS_URL ?? 'ws://localhost:4000',
  },
  pagination: {
    messagesPerPage: 50,
    filesPerPage: 24,
  },
} as const

export const STORAGE_KEYS = {
  THEME: 'nx:theme',
  SIDEBAR_COLLAPSED: 'nx:sidebar-collapsed',
  ACTIVE_TEAM: 'nx:active-team',
} as const
